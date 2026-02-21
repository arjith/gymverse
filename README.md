# 💪 GymVerse — Your Fitness Universe

A full-stack fitness application with an exercise library, fun cardio hub, and goal-based routine builder.

## Features

### 🏋️ Exercise Library (60+ exercises)
- Browse exercises by muscle group, equipment, and difficulty
- **Alternate exercise suggestions** for every move — swap any exercise for a similar one
- Detailed instructions and pro tips for each exercise
- Search and filter across 8 muscle groups

### 🎉 Fun Cardio Hub (35+ activities)
- Discover cardio beyond the treadmill — dance, sports, outdoor, playful, mind-body activities
- **"Surprise Me!" button** for random activity suggestions
- Fun ratings (★★★★★), intensity levels, calories/hr
- Each activity includes "How to Start" guides

### 🎯 Goal-Based Routine Builder
- Select from 7 fitness goals: Weight Loss, Muscle Building, Endurance, Flexibility, General Fitness, Athletic Performance, Stress Relief
- Customize: days/week, session duration, fitness level, available equipment
- **AI-powered routine generation** with intelligent exercise selection
- Each exercise comes with alternate options for variety
- Preview before saving, regenerate for different variations

### 🔐 Authentication
- JWT-based auth with login/register
- Demo account: `demo@gymverse.com` / `password123`

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, Redux Toolkit, React Router v6, SCSS |
| Backend | Express.js, TypeScript, JWT, bcryptjs |
| Design | Dark theme with neon green (#9EFD38) accent |

## Quick Start

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend in dev mode
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API health: http://localhost:5000/api/health

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | List exercises (filters: muscleGroup, equipment, difficulty, search) |
| GET | `/api/exercises/:id` | Exercise detail with populated alternates |
| GET | `/api/exercises/:id/alternates` | Get alternate exercises |
| GET | `/api/cardio` | List cardio activities (filters: category, intensityLevel, funRating) |
| GET | `/api/cardio/random` | Random cardio suggestion |
| POST | `/api/routines/preview` | Preview a generated routine (no auth) |
| POST | `/api/routines/generate` | Generate & save routine (auth required) |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |

## Project Structure

```
gymverse/
├── backend/
│   └── src/
│       ├── data/          # Exercise & cardio JSON seed data
│       ├── middleware/     # JWT auth middleware
│       ├── routes/         # API route handlers
│       ├── services/       # Routine generator engine
│       ├── types/          # TypeScript interfaces
│       └── server.ts       # Express app entry
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── services/       # API service layer (Axios)
│       ├── store/          # Redux Toolkit slices
│       ├── styles/         # SCSS variables & globals
│       └── types/          # Frontend TypeScript types
└── package.json            # Monorepo root scripts
```
