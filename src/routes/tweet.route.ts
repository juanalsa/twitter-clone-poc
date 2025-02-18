import { Hono } from 'hono';
import { registerTweet } from '../controllers/tweet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const tweetRoute = new Hono();

tweetRoute.post('/tweet', authMiddleware, ...registerTweet);

export default tweetRoute;
