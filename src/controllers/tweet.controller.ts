import { Context } from 'hono';
import { createFactory } from 'hono/factory';
import { createTweet } from '../utils/db';
import { CreateTweetData, TweetEvent } from '../utils/types';

const factory = createFactory();

// Create tweet handler
export const registerTweet = factory.createHandlers(async (c: Context) => {
  const { content } = await c.req.json();
  const user = c.get('user');
  const queue = c.env.TWEET_QUEUE;
  let tweet;

  // Validate input
  if (!content) return c.json({ error: 'Content is required' }, 400);

  const createTweetData: CreateTweetData = {
    userId: user.id,
    content,
  };

  console.log('Tweet data:', createTweetData);

  try {
    // Save tweet to database
    tweet = await createTweet(c.env.DATABASE_URL, createTweetData);
  } catch (error) {
    console.error('Error creating tweet:', error);
    return c.json({ error: 'Error processing your request' }, 500);
  }

  const event: TweetEvent = {
    tweetId: tweet.id,
    userId: user.id,
    content: tweet.content,
  };

  try {
    // Enqueue tweet for indexing and notification
    await queue.send(event);
  } catch (error) {
    console.error('Error enqueuing tweet:', error);
    return c.json({ error }, 500);
  }

  return c.json(
    { message: 'Tweet published and queued for processing' },
    201
  );
});
