import { Hono } from 'hono';
import { loginUser, registerUser } from '../controllers/auth.controller';

const authRoute = new Hono();

authRoute.post('/login', ...loginUser);
authRoute.post('/register', ...registerUser);

export default authRoute;
