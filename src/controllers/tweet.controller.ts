import { Context } from 'hono';
import { createFactory } from 'hono/factory';
import { createTweet, CreateTweetData } from '../utils/db';

const factory = createFactory();

export const registerTweet = factory.createHandlers(async (c: Context) => {
  const { content } = await c.req.json();
  const user = c.get('user');

  if (!content) return c.json({ error: 'Content is required' }, 400);

  const createTweetData: CreateTweetData = {
    user,
    content,
  };

  console.log('Tweet data:', createTweetData);

  try {
    // Save tweet to database
    await createTweet(c.env.DATABASE_URL, createTweetData);

    return c.json({ message: 'Tweet created successfully' }, 201);
  } catch (error) {
    console.error('Error creating tweet:', error);

    return c.json({ error: 'Error processing your request' }, 500);
  }
});
