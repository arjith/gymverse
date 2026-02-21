import { Router, Request, Response } from 'express';
import { CardioActivity } from '../types';
import cardioData from '../data/cardio.json';

const router = Router();
const cardioActivities: CardioActivity[] = cardioData as CardioActivity[];

// GET /api/cardio - List all with filters
router.get('/', (req: Request, res: Response) => {
  let result = [...cardioActivities];

  const { category, intensityLevel, funRating, tags, search } = req.query;

  if (category && typeof category === 'string') {
    result = result.filter((c) => c.category === category);
  }

  if (intensityLevel && typeof intensityLevel === 'string') {
    result = result.filter((c) => c.intensityLevel === intensityLevel);
  }

  if (funRating && typeof funRating === 'string') {
    const minRating = parseInt(funRating, 10);
    if (!isNaN(minRating)) {
      result = result.filter((c) => c.funRating >= minRating);
    }
  }

  if (tags && typeof tags === 'string') {
    const tagList = tags.split(',');
    result = result.filter((c) => tagList.some((t) => c.tags.includes(t.trim())));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ cardio: result, total: result.length });
});

// GET /api/cardio/random - Get a random cardio activity
router.get('/random', (req: Request, res: Response) => {
  let pool = [...cardioActivities];

  const { category, intensityLevel, tags } = req.query;

  if (category && typeof category === 'string') {
    pool = pool.filter((c) => c.category === category);
  }

  if (intensityLevel && typeof intensityLevel === 'string') {
    pool = pool.filter((c) => c.intensityLevel === intensityLevel);
  }

  if (tags && typeof tags === 'string') {
    const tagList = tags.split(',');
    pool = pool.filter((c) => tagList.some((t) => c.tags.includes(t.trim())));
  }

  if (pool.length === 0) {
    res.status(404).json({ error: 'No matching cardio activities found' });
    return;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  res.json({ cardio: pool[randomIndex] });
});

// GET /api/cardio/categories - Get available categories
router.get('/categories', (_req: Request, res: Response) => {
  const categories = [...new Set(cardioActivities.map((c) => c.category))];
  res.json({ categories });
});

// GET /api/cardio/:id - Get single cardio activity
router.get('/:id', (req: Request, res: Response) => {
  const activity = cardioActivities.find((c) => c.id === req.params.id);
  if (!activity) {
    res.status(404).json({ error: 'Cardio activity not found' });
    return;
  }
  res.json({ cardio: activity });
});

export default router;
