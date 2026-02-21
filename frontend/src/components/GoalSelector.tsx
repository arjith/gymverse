import { FitnessGoal } from '../types';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function GoalSelector({ selected, onSelect }: Props) {
  return (
    <div className="goal-selector">
      <h2 className="goal-selector__title">What's Your Goal?</h2>
      <motion.div
        className="goal-selector__grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {goals.map((g) => (
          <motion.button
            key={g.value}
            className={`goal-selector__card ${selected === g.value ? 'goal-selector__card--active' : ''}`}
            onClick={() => onSelect(g.value)}
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="goal-selector__emoji"
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {g.emoji}
            </motion.span>
            <span className="goal-selector__label">{g.label}</span>
            <span className="goal-selector__desc">{g.desc}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
