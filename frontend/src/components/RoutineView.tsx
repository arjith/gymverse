import { Routine } from '../types';
import './RoutineView.scss';

interface Props {
  routine: Routine;
  onDelete?: (id: string) => void;
}

export default function RoutineView({ routine, onDelete }: Props) {
  const week = routine.weeks[0];

  return (
    <div className="routine-view">
      <div className="routine-view__header">
        <div>
          <h2 className="routine-view__name">{routine.name}</h2>
          <div className="routine-view__meta">
            <span className="routine-view__badge">{routine.goal}</span>
            <span className="routine-view__badge routine-view__badge--info">{routine.fitnessLevel}</span>
            <span className="routine-view__info">{routine.daysPerWeek} days/week</span>
            <span className="routine-view__info">{routine.sessionDurationMin} min/session</span>
          </div>
        </div>
        {onDelete && (
          <button className="routine-view__delete" onClick={() => onDelete(routine.id)}>
            🗑️ Delete
          </button>
        )}
      </div>

      <div className="routine-view__days">
        {week?.days.map((day) => (
          <div key={day.dayNumber} className="routine-view__day">
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
                  <tr key={i}>
                    <td>{ex.order}</td>
                    <td className="routine-view__exname">{ex.exerciseId}</td>
                    <td>{ex.sets}</td>
                    <td>{ex.reps}</td>
                    <td>{ex.restSeconds}s</td>
                    <td>{ex.alternateIds.length > 0 ? `${ex.alternateIds.length} 🔄` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {day.cardio && (
              <div className="routine-view__cardio">
                🏃 Cardio: <strong>{day.cardio.cardioId}</strong> — {day.cardio.durationMin} min
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
