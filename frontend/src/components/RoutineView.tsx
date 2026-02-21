import { Routine } from '../types';
import { motion } from 'framer-motion';
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

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + i * 0.04, duration: 0.3 },
  }),
};

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
              Day {day.dayNumber} — <span>{day.focus}</span>
            </h3>

            <table className="routine-view__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Rest</th>
                  <th>Alts</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => (
                  <motion.tr
                    key={i}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <td>{ex.order}</td>
                    <td className="routine-view__exname">{ex.exerciseId}</td>
                    <td>{ex.sets}</td>
                    <td>{ex.reps}</td>
                    <td>{ex.restSeconds}s</td>
                    <td>{ex.alternateIds.length > 0 ? `${ex.alternateIds.length} 🔄` : '—'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {day.cardio && (
              <motion.div
                className="routine-view__cardio"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                🏃 Cardio: <strong>{day.cardio.cardioId}</strong> — {day.cardio.durationMin} min
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
