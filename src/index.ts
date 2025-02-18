import { Hono } from 'hono';
import authRoute from './routes/auth.route';
import tweetRoute from './routes/tweet.route';
import { processQueue } from './workers/queue.worker';

export interface Env {
  TWEET_QUEUE: Queue<any>;
}

const app = new Hono();

app.route('/auth', authRoute);
app.route('/tweets', tweetRoute);

export default {
    fetch: app.fetch,
    queue: processQueue
};
