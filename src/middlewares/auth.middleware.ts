import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
// import { findUserById } from '../utils/db';

export const authMiddleware = async (c: Context, next: Next) => {
  const JWT_SECRET = c.env.JWT_SECRET || 'default_secret';

  const authHeader = c.req.header('Authorization');

  if (!authHeader) return c.json({ error: 'No token provided' }, 401);

  if (!authHeader.startsWith('Bearer: '))
    return c.json({ error: 'Invalid token format' }, 401);

  const token = authHeader.split(' ')[1];

  try {
    const decodedPayload = await verify(token, JWT_SECRET);
    console.log('Decoded payload:', decodedPayload);
    // const user = await findUserById(c.env.DATABASE_URL, decodedPayload.id);
    // if (!user) return c.json({ error: 'Invalid token - User not found' }, 401);

    c.set('user', decodedPayload);

    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};
