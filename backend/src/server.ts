import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import exerciseRoutes from './routes/exercises';
import cardioRoutes from './routes/cardio';
import routineRoutes from './routes/routines';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/cardio', cardioRoutes);
app.use('/api/routines', routineRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`GymVerse API running on http://localhost:${PORT}`);
});

export default app;
