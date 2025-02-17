import bcrypt from 'bcryptjs';
import { Context } from 'hono';
import { createFactory } from 'hono/factory';
import { sign } from 'hono/jwt';
import { createUser, findUserByEmail, RegisterUserData } from '../utils/db';
import { Validators } from '../utils/validators';

const factory = createFactory();

export const registerUser = factory.createHandlers(async (c: Context) => {
  const { username, email, password, bio = '' } = await c.req.json();

  if (!username) return c.json({ error: 'Username is required' }, 400);

  if (!email) return c.json({ error: 'Email is required' }, 400);

  if (!Validators.email.test(email))
    return c.json({ error: 'Invalid email format' }, 400);

  if (!password) return c.json({ error: 'Password is required' }, 400);

  if (password.length < 8)
    return c.json(
      { error: 'Password must be at least 8 characters long' },
      400
    );

  const hashedPassword = await bcrypt.hash(password, 10);

  const registerUserData: RegisterUserData = {
    username,
    email,
    password: hashedPassword,
    bio,
  };

  console.log('User data:', registerUserData);

  try {
    // Save user to database
    await createUser(c.env.DATABASE_URL, registerUserData);

    return c.json({ message: 'User successfully registered' }, 200);
  } catch (error) {
    console.error('Error creating user:', error);

    return c.json({ error: 'Error processing your request' }, 500);
  }
});

export const loginUser = factory.createHandlers(async (c: Context) => {
  const JWT_SECRET = c.env.JWT_SECRET || 'default_secret';
  const { email, password } = await c.req.json();

  if (!email) return c.json({ error: 'Email is required' }, 400);

  if (!Validators.email.test(email))
    return c.json({ error: 'Envalid email format' }, 400);

  if (!password) return c.json({ error: 'Password is required' }, 400);

  if (password.length < 8)
    return c.json(
      { error: 'Password must be at least 8 characters long' },
      400
    );

  try {
    // Check if user exists in the database
    const user = await findUserByEmail(c.env.DATABASE_URL, email);

    if (!user) return c.json({ error: 'User not found' }, 404);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return c.json({ error: 'Invalid password' }, 401);

    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    };

    const token = await sign(payload, JWT_SECRET);

    if (!token) return c.json({ error: 'Error generating token' }, 500);

    return c.json({ token });
  } catch (error) {
    console.error('Error login user:', error);

    return c.json({ error: 'Error processing your request' }, 500);
  }
});
