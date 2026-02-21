import { Router, Request, Response } from 'express';
import { Exercise } from '../types';
import exercisesData from '../data/exercises.json';

const router = Router();
const exercises: Exercise[] = exercisesData as Exercise[];

// GET /api/exercises - List all with filters
router.get('/', (req: Request, res: Response) => {
  let result = [...exercises];

  const { muscleGroup, equipment, difficulty, search, tags } = req.query;

  if (muscleGroup && typeof muscleGroup === 'string') {
    result = result.filter(
      (e) => e.muscleGroup === muscleGroup || e.secondaryMuscles.includes(muscleGroup as any)
    );
  }

  if (equipment && typeof equipment === 'string') {
    result = result.filter((e) => e.equipment === equipment);
  }

  if (difficulty && typeof difficulty === 'string') {
    result = result.filter((e) => e.difficulty === difficulty);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (tags && typeof tags === 'string') {
    const tagList = tags.split(',');
    result = result.filter((e) => tagList.some((t) => e.tags.includes(t.trim())));
  }

  res.json({ exercises: result, total: result.length });
});

// GET /api/exercises/muscle-groups - Get available muscle groups
router.get('/muscle-groups', (_req: Request, res: Response) => {
  const groups = [...new Set(exercises.map((e) => e.muscleGroup))];
  res.json({ muscleGroups: groups });
});

// GET /api/exercises/:id - Get exercise with populated alternates
router.get('/:id', (req: Request, res: Response) => {
  const exercise = exercises.find((e) => e.id === req.params.id);
  if (!exercise) {
    res.status(404).json({ error: 'Exercise not found' });
    return;
  }

  const alternates = exercise.alternateExerciseIds
    .map((altId) => exercises.find((e) => e.id === altId))
    .filter(Boolean);

  res.json({ exercise, alternates });
});

// GET /api/exercises/:id/alternates - Get just the alternates
router.get('/:id/alternates', (req: Request, res: Response) => {
  const exercise = exercises.find((e) => e.id === req.params.id);
  if (!exercise) {
    res.status(404).json({ error: 'Exercise not found' });
    return;
  }

  const alternates = exercise.alternateExerciseIds
    .map((altId) => exercises.find((e) => e.id === altId))
    .filter(Boolean);

  res.json({ alternates });
});

export default router;
export { exercises };
