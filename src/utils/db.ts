import { Client } from '@neondatabase/serverless';
import { CreateTweetData, NotificationData, RegisterUserData } from './types';

/**
 * Create a new user in the Neon database
 * @param connectionString String String to connect to the Neon database
 * @param registerUserData Register user data
 * @returns User object if created, otherwise null
 */
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

/**
 * Find a user by email in the Neon database
 * @param connectionString String to connect to the Neon database
 * @param email String Email of the user to find
 * @returns User object if found, otherwise null
 */
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

/**
 * Find a user by id in the Neon database
 * @param connectionString String to connect to the Neon database
 * @param id String Id of the user to find
 * @returns User object if found, otherwise null
 */
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

/**
 * Create a new tweet in the Neon database
 * @param connectionString String to connect to the Neon database
 * @param createTweetData Create tweet data
 * @returns Tweet object if created, otherwise null
 */
export const createTweet = async (
  connectionString: string,
  createTweetData: CreateTweetData
) => {
  const client = new Client({
    connectionString,
  });

  await client.connect();

  const { rows } = await client.query(
    'INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING id, content',
    [createTweetData.userId, createTweetData.content]
  );

  const tweet = rows[0];
  return tweet;
};

/**
 * Create a new notification in the Neon database
 * @param connectionString String to connect to the Neon database
 * @param notificationData Notification data
 * @returns Notification object if created, otherwise null
 */
export const createNotification = async (
  connectionString: string,
  notificationData: NotificationData
) => {
  const client = new Client({
    connectionString,
  });

  await client.connect();

  const { rows } = await client.query(
    'INSERT INTO notifications (user_id, type, reference_id) VALUES ((SELECT id FROM users WHERE username = $1), $2, $3)',
    [
      notificationData.userName,
      notificationData.type,
      notificationData.referenceId,
    ]
  );

  const notification = rows[0];
  return notification;
};
