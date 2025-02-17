import { Hono } from 'hono';
import authRoute from './routes/auth.route';
import tweetRoute from './routes/tweet.route';

const app = new Hono();

app.route('/auth', authRoute);
app.route('/tweets', tweetRoute);

export default app;
