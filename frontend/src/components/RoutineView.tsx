import { useState } from 'react';
import { Routine, RoutineExercise } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import ExercisePlayer from './ExercisePlayer';
import ExerciseAnimDemo from './ExerciseAnimDemo';
import './RoutineView.scss';

interface Props {
  routine: Routine;
  onDelete?: (id: string) => void;
}

const dayVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const focusEmoji: Record<string, string> = {
  chest: '🏋️',
  back: '🔙',
  shoulder: '💪',
  leg: '🦵',
  arm: '💪',
  core: '🎯',
  glute: '🍑',
  push: '🫸',
  pull: '🫷',
  cardio: '🏃',
  full: '⚡',
};

function getFocusEmoji(focus: string): string {
  const lower = focus.toLowerCase();
  for (const [key, emoji] of Object.entries(focusEmoji)) {
    if (lower.includes(key)) return emoji;
  }
  return '💪';
}

function ExerciseRow({ ex, index }: { ex: RoutineExercise; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const name = ex.exerciseName || ex.exerciseId;

  return (
    <motion.div
      className="routine-view__exercise"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08 + index * 0.04, duration: 0.3 }}
    >
      <motion.div
        className="routine-view__exercise-row"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ backgroundColor: 'rgba(158,253,56,0.03)' }}
      >
        <div className="routine-view__exercise-thumb">
          {ex.imageUrls && ex.imageUrls.length > 0 ? (
            <ExerciseAnimDemo
              images={ex.imageUrls}
              alt={name}
            />
          ) : (
            <div className="routine-view__exercise-placeholder">
              {ex.order}
            </div>
          )}
        </div>

        <div className="routine-view__exercise-info">
          <span className="routine-view__exercise-name">{name}</span>
          {ex.muscleGroup && (
            <span className="routine-view__exercise-muscle">{ex.muscleGroup}</span>
          )}
        </div>

        <div className="routine-view__exercise-stats">
          <span className="routine-view__stat-badge">{ex.sets}×{ex.reps}</span>
          <span className="routine-view__stat-rest">{ex.restSeconds}s rest</span>
        </div>

        <div className="routine-view__exercise-expand">
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▾
          </motion.span>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="routine-view__expand-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <div className="routine-view__expand-content">
              {ex.imageUrls && ex.imageUrls.length > 0 && (
                <div className="routine-view__expand-player">
                  <ExercisePlayer
                    images={ex.imageUrls}
                    exerciseName={name}
                    muscleGroup={ex.muscleGroup || ''}
                    size="md"
                  />
                </div>
              )}
              <div className="routine-view__expand-details">
                {ex.equipment && (
                  <div className="routine-view__expand-meta">
                    <span className="routine-view__badge">{ex.equipment}</span>
                    {ex.alternateIds.length > 0 && (
                      <span className="routine-view__badge routine-view__badge--info">
                        🔄 {ex.alternateIds.length} alternate{ex.alternateIds.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}
                {ex.instructions && ex.instructions.length > 0 && (
                  <div className="routine-view__expand-instructions">
                    <h4>How to Perform</h4>
                    <ol>
                      {ex.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {ex.tips && ex.tips.length > 0 && (
                  <div className="routine-view__expand-tips">
                    <h4>💡 Tips</h4>
                    <ul>
                      {ex.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RoutineView({ routine, onDelete }: Props) {
  const week = routine.weeks[0];

  return (
    <motion.div
      className="routine-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="routine-view__header">
        <div>
          <motion.h2
            className="routine-view__name"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {routine.name}
          </motion.h2>
          <motion.div
            className="routine-view__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className="routine-view__badge">{routine.goal}</span>
            <span className="routine-view__badge routine-view__badge--info">{routine.fitnessLevel}</span>
            <span className="routine-view__info">{routine.daysPerWeek} days/week</span>
            <span className="routine-view__info">{routine.sessionDurationMin} min/session</span>
          </motion.div>
        </div>
        {onDelete && (
          <motion.button
            className="routine-view__delete"
            onClick={() => onDelete(routine.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            🗑️ Delete
          </motion.button>
        )}
      </div>

      <div className="routine-view__days">
        {week?.days.map((day, dayIdx) => (
          <motion.div
            key={day.dayNumber}
            className="routine-view__day"
            custom={dayIdx}
            variants={dayVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <h3 className="routine-view__day-title">
              <span className="routine-view__day-emoji">{getFocusEmoji(day.focus)}</span>
              Day {day.dayNumber} — <span>{day.focus}</span>
            </h3>

            <div className="routine-view__exercise-list">
              {day.exercises.map((ex, i) => (
                <ExerciseRow key={`${ex.exerciseId}-${i}`} ex={ex} index={i} />
              ))}
            </div>

            {day.cardio && (
              <motion.div
                className="routine-view__cardio"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {day.cardio.imageUrl && (
                  <img
                    src={day.cardio.imageUrl}
                    alt={day.cardio.cardioName || day.cardio.cardioId}
                    className="routine-view__cardio-img"
                  />
                )}
                <div className="routine-view__cardio-info">
                  <span className="routine-view__cardio-label">🏃 Cardio</span>
                  <strong>{day.cardio.cardioName || day.cardio.cardioId}</strong>
                  <span className="routine-view__cardio-duration">{day.cardio.durationMin} min</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
