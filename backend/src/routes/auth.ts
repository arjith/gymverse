import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, RegisterRequest, LoginRequest } from '../types';
import { generateToken } from '../middleware/auth';

const router = Router();

// In-memory user store
const users: User[] = [
  {
    id: 'demo-user-1',
    email: 'demo@gymverse.com',
    name: 'Demo User',
    passwordHash: bcrypt.hashSync('password123', 10),
    fitnessLevel: 'intermediate',
    weight: 75,
    height: 175,
    age: 28,
    preferredEquipment: ['barbell', 'dumbbell', 'bodyweight'],
    createdAt: new Date().toISOString(),
  },
];

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name, fitnessLevel }: RegisterRequest = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: uuidv4(),
    email,
    name,
    passwordHash,
    fitnessLevel: fitnessLevel || 'beginner',
    preferredEquipment: [],
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  const token = generateToken({ userId: user.id, email: user.email });
  const { passwordHash: _, ...userWithoutPassword } = user;
  res.status(201).json({ token, user: userWithoutPassword });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = generateToken({ userId: user.id, email: user.email });
  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'gymverse-secret-key-change-in-production'
    ) as { userId: string; email: string };

    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
export { users };
