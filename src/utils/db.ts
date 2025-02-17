import { Client } from '@neondatabase/serverless';

export type RegisterUserData = {
  username: string;
  email: string;
  password: string;
  bio?: string;
};

export type LoginUserData = {
  email: string;
  password: string;
};

export type CreateTweetData = {
  user: string;
  content: string;
};

export const createUser = async (
  connectionString: string,
  registerUserData: RegisterUserData
) => {
  const client = new Client({
    connectionString,
  });

  await client.connect();

  const { rows } = await client.query(
    'INSERT INTO users (username, email, password, bio) VALUES ($1, $2, $3, $4)',
    [
      registerUserData.username,
      registerUserData.email,
      registerUserData.password,
      registerUserData.bio || '',
    ]
  );

  const users = rows;
  return users;
};

export const findUserByEmail = async (
  connectionString: string,
  email: string
) => {
  const client = new Client({
    connectionString,
  });

  await client.connect();

  const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  const userFromDb = rows[0];
  return userFromDb;
};

export const findUserById = async (connectionString: string, id: string) => {
  const client = new Client({
    connectionString,
  });

  await client.connect();

  const { rows } = await client.query('SELECT * FROM users WHERE id = $1', [
    id,
  ]);

  const userFromDb = rows[0];
  return userFromDb;
};

export const createTweet = async (
  connectionString: string,
  createTweetData: CreateTweetData
) => {
  const client = new Client({
    connectionString,
  });

  await client.connect();

  const { rows } = await client.query(
    'INSERT INTO tweets (user_id, content) VALUES ($1, $2)',
    [createTweetData.user, createTweetData.content]
  );

  const tweets = rows;
  return tweets;
};
