import { Exercise } from '../types';
import './ExerciseCard.scss';

interface Props {
  exercise: Exercise;
  onSelect: (e: Exercise) => void;
  compact?: boolean;
}

const difficultyColor: Record<string, string> = {
  beginner: '#00cc88',
  intermediate: '#ffaa00',
  advanced: '#ff4444',
};

export default function ExerciseCard({ exercise, onSelect, compact }: Props) {
  return (
    <div className={`exercise-card ${compact ? 'exercise-card--compact' : ''}`} onClick={() => onSelect(exercise)}>
      <div className="exercise-card__header">
        <h3 className="exercise-card__name">{exercise.name}</h3>
        <span
          className="exercise-card__difficulty"
          style={{ color: difficultyColor[exercise.difficulty] }}
        >
          {exercise.difficulty}
        </span>
      </div>

      <div className="exercise-card__meta">
        <span className="exercise-card__muscle">{exercise.muscleGroup}</span>
        <span className="exercise-card__equipment">{exercise.equipment}</span>
      </div>

      {!compact && exercise.tags.length > 0 && (
        <div className="exercise-card__tags">
          {exercise.tags.slice(0, 3).map((t) => (
            <span key={t} className="exercise-card__tag">{t}</span>
          ))}
        </div>
      )}

      {exercise.alternateExerciseIds.length > 0 && (
        <div className="exercise-card__alts">
          🔄 {exercise.alternateExerciseIds.length} alternate{exercise.alternateExerciseIds.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
