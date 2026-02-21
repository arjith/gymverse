import { v4 as uuidv4 } from 'uuid';
import {
  Exercise,
  CardioActivity,
  GenerateRoutineRequest,
  Routine,
  RoutineDay,
  RoutineExercise,
  RoutineCardio,
  FitnessGoal,
  MuscleGroup,
  Equipment,
  FitnessLevel,
} from '../types';
import exercisesData from '../data/exercises.json';
import cardioData from '../data/cardio.json';

const exercises: Exercise[] = exercisesData as Exercise[];
const cardioActivities: CardioActivity[] = cardioData as CardioActivity[];

// Goal-specific configuration
interface GoalConfig {
  strengthRatio: number; // 0-1 how much of session is strength
  cardioRatio: number; // 0-1 how much of session is cardio
  preferredIntensity: string[];
  preferFunCardio: boolean;
  compoundPriority: boolean; // prioritize compound exercises
  setsRange: [number, number];
  repsRange: [number, number];
  restRange: [number, number]; // seconds
}

const goalConfigs: Record<FitnessGoal, GoalConfig> = {
  'weight-loss': {
    strengthRatio: 0.4,
    cardioRatio: 0.6,
    preferredIntensity: ['hiit', 'high'],
    preferFunCardio: true,
    compoundPriority: true,
    setsRange: [3, 4],
    repsRange: [12, 15],
    restRange: [30, 60],
  },
  'muscle-building': {
    strengthRatio: 0.85,
    cardioRatio: 0.15,
    preferredIntensity: ['low', 'moderate'],
    preferFunCardio: false,
    compoundPriority: true,
    setsRange: [3, 5],
    repsRange: [6, 12],
    restRange: [60, 120],
  },
  endurance: {
    strengthRatio: 0.35,
    cardioRatio: 0.65,
    preferredIntensity: ['moderate', 'high'],
    preferFunCardio: true,
    compoundPriority: false,
    setsRange: [2, 3],
    repsRange: [15, 20],
    restRange: [30, 45],
  },
  flexibility: {
    strengthRatio: 0.3,
    cardioRatio: 0.7,
    preferredIntensity: ['low', 'moderate'],
    preferFunCardio: true,
    compoundPriority: false,
    setsRange: [2, 3],
    repsRange: [10, 15],
    restRange: [30, 60],
  },
  'general-fitness': {
    strengthRatio: 0.5,
    cardioRatio: 0.5,
    preferredIntensity: ['moderate', 'high'],
    preferFunCardio: true,
    compoundPriority: true,
    setsRange: [3, 4],
    repsRange: [10, 12],
    restRange: [45, 90],
  },
  'athletic-performance': {
    strengthRatio: 0.6,
    cardioRatio: 0.4,
    preferredIntensity: ['high', 'hiit'],
    preferFunCardio: false,
    compoundPriority: true,
    setsRange: [3, 5],
    repsRange: [5, 10],
    restRange: [60, 120],
  },
  'stress-relief': {
    strengthRatio: 0.4,
    cardioRatio: 0.6,
    preferredIntensity: ['low', 'moderate'],
    preferFunCardio: true,
    compoundPriority: false,
    setsRange: [2, 3],
    repsRange: [10, 15],
    restRange: [60, 90],
  },
};

// Day focus templates by days per week
const dayFocusTemplates: Record<number, string[][]> = {
  3: [
    ['Push Day (Chest & Shoulders)', 'Pull Day (Back & Arms)', 'Legs & Core'],
    ['Upper Body', 'Lower Body & Core', 'Full Body + Cardio'],
  ],
  4: [
    [
      'Push Day (Chest & Shoulders)',
      'Pull Day (Back & Arms)',
      'Legs & Glutes',
      'Core & Cardio Fun Day',
    ],
  ],
  5: [
    [
      'Chest & Triceps',
      'Back & Biceps',
      'Legs & Glutes',
      'Shoulders & Core',
      'Cardio Fun Day',
    ],
  ],
  6: [
    [
      'Push (Chest & Shoulders)',
      'Pull (Back & Biceps)',
      'Legs',
      'Push (Shoulders & Triceps)',
      'Pull (Back & Core)',
      'Legs & Cardio Fun',
    ],
  ],
};

// Map day focus names → primary muscle groups targeted
function getMuscleGroupsForFocus(focus: string): MuscleGroup[] {
  const lower = focus.toLowerCase();
  const groups: MuscleGroup[] = [];

  if (lower.includes('chest')) groups.push('chest');
  if (lower.includes('back')) groups.push('back');
  if (lower.includes('shoulder')) groups.push('shoulders');
  if (lower.includes('leg')) groups.push('legs');
  if (lower.includes('arm') || lower.includes('bicep') || lower.includes('tricep'))
    groups.push('arms');
  if (lower.includes('core')) groups.push('core');
  if (lower.includes('glute')) groups.push('glutes');
  if (lower.includes('full body') || lower.includes('full-body') || lower.includes('upper body'))
    groups.push('chest', 'back', 'shoulders', 'arms');
  if (lower.includes('lower body')) groups.push('legs', 'glutes');
  if (lower.includes('push')) {
    if (!groups.includes('chest')) groups.push('chest');
    if (!groups.includes('shoulders')) groups.push('shoulders');
  }
  if (lower.includes('pull')) {
    if (!groups.includes('back')) groups.push('back');
    if (!groups.includes('arms')) groups.push('arms');
  }

  return groups.length > 0 ? groups : ['full-body'];
}

function filterByEquipment(pool: Exercise[], available?: Equipment[]): Exercise[] {
  if (!available || available.length === 0) return pool;
  return pool.filter(
    (e) => available.includes(e.equipment) || e.equipment === 'bodyweight' || e.equipment === 'none'
  );
}

function filterByDifficulty(pool: Exercise[], level: FitnessLevel): Exercise[] {
  if (level === 'beginner') {
    return pool.filter((e) => e.difficulty === 'beginner' || e.difficulty === 'intermediate');
  }
  if (level === 'advanced') {
    return pool;
  }
  return pool; // intermediate can do all
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectCardio(config: GoalConfig): CardioActivity {
  let pool = [...cardioActivities];

  if (config.preferFunCardio) {
    pool = pool.filter((c) => c.funRating >= 4);
  }

  const intensityFiltered = pool.filter((c) =>
    config.preferredIntensity.includes(c.intensityLevel)
  );

  const finalPool = intensityFiltered.length > 0 ? intensityFiltered : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

export function generateRoutine(
  request: GenerateRoutineRequest,
  userId: string
): Routine {
  const config = goalConfigs[request.goal];
  const { daysPerWeek, sessionDurationMin, fitnessLevel, availableEquipment } = request;

  // Clamp days to supported range
  const days = Math.min(Math.max(daysPerWeek, 3), 6);

  // Select day focus template
  const templates = dayFocusTemplates[days];
  const focusTemplate = templates[Math.floor(Math.random() * templates.length)];

  // Calculate how many exercises fit per session
  const strengthMinutes = Math.round(sessionDurationMin * config.strengthRatio);
  const avgExerciseMinutes = 5; // rough avg per exercise including rest
  const exercisesPerDay = Math.max(3, Math.min(8, Math.floor(strengthMinutes / avgExerciseMinutes)));

  // Build each day
  const routineDays: RoutineDay[] = focusTemplate.map((focus, idx) => {
    const targetMuscles = getMuscleGroupsForFocus(focus);
    const isCardioDay = focus.toLowerCase().includes('cardio');

    // Get exercise pool for this day
    let pool = exercises.filter(
      (e) =>
        targetMuscles.includes(e.muscleGroup) ||
        e.secondaryMuscles.some((m) => targetMuscles.includes(m))
    );

    pool = filterByEquipment(pool, availableEquipment);
    pool = filterByDifficulty(pool, fitnessLevel);

    // Prioritize compound movements if configured
    if (config.compoundPriority) {
      const compounds = pool.filter((e) => e.tags.includes('compound'));
      const isolations = pool.filter((e) => !e.tags.includes('compound'));
      const compoundCount = Math.ceil(exercisesPerDay * 0.6);
      const isoCount = exercisesPerDay - compoundCount;

      pool = [...pickRandom(compounds, compoundCount), ...pickRandom(isolations, isoCount)];
    } else {
      pool = pickRandom(pool, exercisesPerDay);
    }

    // If not enough exercises found, pad with full-body exercises
    if (pool.length < 3) {
      const fallback = exercises.filter(
        (e) => e.muscleGroup === 'full-body' || e.tags.includes('compound')
      );
      pool = [...pool, ...pickRandom(fallback, 3 - pool.length)];
    }

    const dayExercises: RoutineExercise[] = pool.slice(0, exercisesPerDay).map((ex, order) => ({
      exerciseId: ex.id,
      sets: randomInRange(config.setsRange[0], config.setsRange[1]),
      reps: randomInRange(config.repsRange[0], config.repsRange[1]),
      restSeconds: randomInRange(config.restRange[0], config.restRange[1]),
      order: order + 1,
      alternateIds: ex.alternateExerciseIds,
    }));

    // Add cardio
    let cardio: RoutineCardio | undefined;
    const includeCardio = isCardioDay || config.cardioRatio >= 0.3 || Math.random() < config.cardioRatio;

    if (includeCardio) {
      const selectedCardio = selectCardio(config);
      const cardioMinutes = isCardioDay
        ? Math.round(sessionDurationMin * 0.7)
        : Math.round(sessionDurationMin * config.cardioRatio * 0.5);

      cardio = {
        cardioId: selectedCardio.id,
        durationMin: Math.max(10, Math.min(45, cardioMinutes)),
      };
    }

    return {
      dayNumber: idx + 1,
      focus,
      exercises: dayExercises,
      cardio,
    };
  });

  const routine: Routine = {
    id: uuidv4(),
    userId,
    name: `${formatGoalName(request.goal)} - ${days} Day Plan`,
    goal: request.goal,
    daysPerWeek: days,
    sessionDurationMin,
    fitnessLevel,
    availableEquipment,
    weeks: [{ weekNumber: 1, days: routineDays }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return routine;
}

function formatGoalName(goal: FitnessGoal): string {
  return goal
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
