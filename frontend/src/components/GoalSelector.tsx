import { FitnessGoal } from '../types';
import './GoalSelector.scss';

interface Props {
  selected: FitnessGoal | '';
  onSelect: (g: FitnessGoal) => void;
}

const goals: { value: FitnessGoal; label: string; emoji: string; desc: string }[] = [
  { value: 'weight-loss', label: 'Weight Loss', emoji: '🔥', desc: 'Burn fat with high-calorie workouts' },
  { value: 'muscle-building', label: 'Muscle Building', emoji: '💪', desc: 'Pack on size with progressive overload' },
  { value: 'endurance', label: 'Endurance', emoji: '🏃', desc: 'Build stamina and cardiovascular fitness' },
  { value: 'flexibility', label: 'Flexibility', emoji: '🧘', desc: 'Improve range of motion and mobility' },
  { value: 'general-fitness', label: 'General Fitness', emoji: '⚡', desc: 'Well-rounded health and wellness' },
  { value: 'athletic-performance', label: 'Athletic Performance', emoji: '🏆', desc: 'Sport-specific power and agility' },
  { value: 'stress-relief', label: 'Stress Relief', emoji: '🧘‍♂️', desc: 'Mind-body balance and relaxation' },
];

export default function GoalSelector({ selected, onSelect }: Props) {
  return (
    <div className="goal-selector">
      <h2 className="goal-selector__title">What's Your Goal?</h2>
      <div className="goal-selector__grid">
        {goals.map((g) => (
          <button
            key={g.value}
            className={`goal-selector__card ${selected === g.value ? 'goal-selector__card--active' : ''}`}
            onClick={() => onSelect(g.value)}
          >
            <span className="goal-selector__emoji">{g.emoji}</span>
            <span className="goal-selector__label">{g.label}</span>
            <span className="goal-selector__desc">{g.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
