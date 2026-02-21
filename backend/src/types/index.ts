// ===== Exercise Types =====
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  instructions: string[];
  tips: string[];
  imageUrl: string;
  imageUrls: string[];
  tags: string[];
  alternateExerciseIds: string[];
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core'
  | 'glutes'
  | 'full-body';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance-band'
  | 'none';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// ===== Cardio Types =====
export interface CardioActivity {
  id: string;
  name: string;
  category: CardioCategory;
  funRating: number; // 1-5
  intensityLevel: IntensityLevel;
  caloriesPerHour: number;
  durationMin: number;
  description: string;
  howToStart: string;
  imageUrl: string;
  tags: string[];
}

export type CardioCategory =
  | 'dance'
  | 'sports'
  | 'outdoor'
  | 'playful'
  | 'traditional'
  | 'mind-body';

export type IntensityLevel = 'low' | 'moderate' | 'high' | 'hiit';

// ===== Routine Types =====
export type FitnessGoal =
  | 'weight-loss'
  | 'muscle-building'
  | 'endurance'
  | 'flexibility'
  | 'general-fitness'
  | 'athletic-performance'
  | 'stress-relief';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
  order: number;
  alternateIds: string[];
}

export interface RoutineCardio {
  cardioId: string;
  durationMin: number;
}

export interface RoutineDay {
  dayNumber: number;
  focus: string;
  exercises: RoutineExercise[];
  cardio?: RoutineCardio;
}

export interface RoutineWeek {
  weekNumber: number;
  days: RoutineDay[];
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  goal: FitnessGoal;
  daysPerWeek: number;
  sessionDurationMin: number;
  fitnessLevel: FitnessLevel;
  availableEquipment: Equipment[];
  weeks: RoutineWeek[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateRoutineRequest {
  goal: FitnessGoal;
  daysPerWeek: number;
  sessionDurationMin: number;
  fitnessLevel: FitnessLevel;
  availableEquipment: Equipment[];
}

// ===== User Types =====
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  fitnessLevel: FitnessLevel;
  weight?: number;
  height?: number;
  age?: number;
  preferredEquipment: Equipment[];
  createdAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  fitnessLevel?: FitnessLevel;
}
