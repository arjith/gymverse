import { CardioActivity } from '../types';
import { motion } from 'framer-motion';
import './CardioCard.scss';

interface Props {
  activity: CardioActivity;
  onSelect: (a: CardioActivity) => void;
  highlight?: boolean;
}

const intensityColor: Record<string, string> = {
  low: '#00cc88',
  moderate: '#ffaa00',
  high: '#ff6644',
  hiit: '#ff2244',
};

function FunStars({ rating }: { rating: number }) {
  return (
    <span className="fun-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className={i <= rating ? 'fun-stars__star--active' : 'fun-stars__star'}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
        >
          ★
        </motion.span>
      ))}
    </span>
  );
}

export default function CardioCard({ activity, onSelect, highlight }: Props) {
  return (
    <motion.div
      className={`cardio-card ${highlight ? 'cardio-card--highlight' : ''}`}
      onClick={() => onSelect(activity)}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(158,253,56,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {activity.imageUrl && (
        <div className="cardio-card__img-wrap">
          <img
            src={activity.imageUrl}
            alt={activity.name}
            className="cardio-card__img"
            loading="lazy"
          />
        </div>
      )}

      <div className="cardio-card__header">
        <h3 className="cardio-card__name">{activity.name}</h3>
        <FunStars rating={activity.funRating} />
      </div>

      <p className="cardio-card__desc">{activity.description}</p>

      <div className="cardio-card__meta">
        <span className="cardio-card__category">{activity.category}</span>
        <span
          className="cardio-card__intensity"
          style={{ color: intensityColor[activity.intensityLevel] }}
        >
          {activity.intensityLevel}
        </span>
        <span className="cardio-card__cal">🔥 {activity.caloriesPerHour} cal/hr</span>
      </div>

      <div className="cardio-card__duration">{activity.durationMin} min recommended</div>
    </motion.div>
  );
}
