import { Hono } from 'hono';
import authRoute from './routes/auth.route';
interface Env { DATABASE_URL: string; }

const app = new Hono();

app.route('/auth', authRoute);

export default app;
