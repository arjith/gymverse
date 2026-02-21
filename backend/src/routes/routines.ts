import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Routine, GenerateRoutineRequest } from '../types';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateRoutine } from '../services/routineGenerator';

const router = Router();

// In-memory routine store
const routines: Routine[] = [];

// POST /api/routines/generate - Generate a routine from goal params
router.post('/generate', authMiddleware, (req: AuthRequest, res: Response) => {
  const body: GenerateRoutineRequest = req.body;

  if (!body.goal || !body.daysPerWeek || !body.sessionDurationMin || !body.fitnessLevel) {
    res.status(400).json({
      error: 'goal, daysPerWeek, sessionDurationMin, and fitnessLevel are required',
    });
    return;
  }

  const routine = generateRoutine(body, req.user!.userId);
  routines.push(routine);
  res.status(201).json({ routine });
});

// POST /api/routines/preview - Generate without saving (no auth required)
router.post('/preview', (req: Request, res: Response) => {
  const body: GenerateRoutineRequest = req.body;

  if (!body.goal || !body.daysPerWeek || !body.sessionDurationMin || !body.fitnessLevel) {
    res.status(400).json({
      error: 'goal, daysPerWeek, sessionDurationMin, and fitnessLevel are required',
    });
    return;
  }

  const routine = generateRoutine(body, 'preview');
  res.json({ routine });
});

// GET /api/routines - Get user's saved routines
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const userRoutines = routines.filter((r) => r.userId === req.user!.userId);
  res.json({ routines: userRoutines });
});

// GET /api/routines/:id - Get routine detail
router.get('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const routine = routines.find(
    (r) => r.id === req.params.id && r.userId === req.user!.userId
  );
  if (!routine) {
    res.status(404).json({ error: 'Routine not found' });
    return;
  }
  res.json({ routine });
});

// PUT /api/routines/:id - Update routine
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const index = routines.findIndex(
    (r) => r.id === req.params.id && r.userId === req.user!.userId
  );
  if (index === -1) {
    res.status(404).json({ error: 'Routine not found' });
    return;
  }

  const updated = {
    ...routines[index],
    ...req.body,
    id: routines[index].id,
    userId: routines[index].userId,
    updatedAt: new Date().toISOString(),
  };
  routines[index] = updated;
  res.json({ routine: updated });
});

// DELETE /api/routines/:id - Delete routine
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const index = routines.findIndex(
    (r) => r.id === req.params.id && r.userId === req.user!.userId
  );
  if (index === -1) {
    res.status(404).json({ error: 'Routine not found' });
    return;
  }

  routines.splice(index, 1);
  res.json({ message: 'Routine deleted' });
});

export default router;
