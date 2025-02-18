import { Context, Next } from 'hono';
import { createFactory } from 'hono/factory';
import { verify } from 'hono/jwt';
import { findUserById } from '../utils/db';

const factory = createFactory();

export const authMiddleware = factory.createMiddleware(
  async (c: Context, next: Next) => {
    const JWT_SECRET = c.env.JWT_SECRET || 'default_secret';
    const authHeader = c.req.header('Authorization');

    // Validate token format and extract token value
    if (!authHeader) return c.json({ error: 'No token provided' }, 401);

    if (!authHeader.startsWith('Bearer '))
      return c.json({ error: 'Invalid token format' }, 401);

    const token = authHeader.split(' ')[1];

    try {
      // Verify token and extract user ID from payload
      const decodedPayload = await verify(token, JWT_SECRET);

      // Retrieve user information from database using the extracted user ID
      const user = await findUserById(
        c.env.DATABASE_URL,
        String(decodedPayload.id)
      );

      if (!user)
        return c.json({ error: 'Invalid token - User not found' }, 401);

      // Set user information as a request-scoped property for later use
      c.set('user', user);

      await next();
    } catch (error) {
      return c.json({ error: 'Invalid token' }, 401);
    }
  }
);
