import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCardio, fetchRandomCardio, setCardioFilters, setSelectedActivity, clearSurprise } from '../store/cardioSlice';
import { motion, AnimatePresence } from 'framer-motion';
import CardioCard from '../components/CardioCard';
import { CardioActivity } from '../types';
import './CardioHub.scss';

const categories = ['', 'dance', 'sports', 'outdoor', 'playful', 'traditional', 'mind-body'];
const intensities = ['', 'low', 'moderate', 'high', 'hiit'];

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function CardioHub() {
  const dispatch = useAppDispatch();
  const { activities, surpriseActivity, loading, filters } = useAppSelector((s) => s.cardio);
  const detailActivity = useAppSelector((s) => s.cardio.selectedActivity);
  const selectActivity = (a: CardioActivity | null) => dispatch(setSelectedActivity(a));

  useEffect(() => {
    if (detailActivity) {
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') selectActivity(null);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [detailActivity]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.category) params.category = filters.category;
    if (filters.intensityLevel) params.intensityLevel = filters.intensityLevel;
    if (filters.funRating) params.funRating = filters.funRating;
    if (filters.search) params.search = filters.search;
    dispatch(fetchCardio(params));
  }, [dispatch, filters]);

  const handleSurprise = () => {
    dispatch(fetchRandomCardio());
  };

  return (
    <div className="cardio-page">
      <div className="page-header">
        <h1>🎉 Cardio Hub</h1>
        <p>Discover fun ways to get your heart pumping — from dance to parkour to trampoline!</p>
      </div>

      <motion.div
        className="cardio-page__controls"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="cardio-page__filters">
          <input
            type="text"
            placeholder="Search cardio..."
            value={filters.search}
            onChange={(e) => dispatch(setCardioFilters({ search: e.target.value }))}
          />
          <select value={filters.category} onChange={(e) => dispatch(setCardioFilters({ category: e.target.value }))}>
            {categories.map((c) => (
              <option key={c} value={c}>{c || 'All Categories'}</option>
            ))}
          </select>
          <select value={filters.intensityLevel} onChange={(e) => dispatch(setCardioFilters({ intensityLevel: e.target.value }))}>
            {intensities.map((i) => (
              <option key={i} value={i}>{i || 'All Intensities'}</option>
            ))}
          </select>
          <select value={filters.funRating} onChange={(e) => dispatch(setCardioFilters({ funRating: e.target.value }))}>
            <option value="">All Fun Levels</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={String(n)}>{'★'.repeat(n)} & up</option>
            ))}
          </select>
        </div>

        <motion.button
          className="cardio-page__surprise"
          onClick={handleSurprise}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎲 Surprise Me!
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {surpriseActivity && (
          <motion.div
            className="cardio-page__surprise-result"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="cardio-page__surprise-header">
              <h2>✨ Your Surprise Activity</h2>
              <button onClick={() => dispatch(clearSurprise())}>✕</button>
            </div>
            <CardioCard activity={surpriseActivity} onSelect={selectActivity} highlight />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <motion.div
          className="cardio-page__grid"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          key={JSON.stringify(filters)}
        >
          {activities.map((a) => (
            <motion.div key={a.id} variants={gridItemVariants}>
              <CardioCard activity={a} onSelect={selectActivity} />
            </motion.div>
          ))}
          {activities.length === 0 && (
            <motion.p
              className="cardio-page__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No cardio activities match your filters.
            </motion.p>
          )}
        </motion.div>
      )}

      {createPortal(
        <AnimatePresence mode="wait">
          {detailActivity && (
            <motion.div
              key={detailActivity.id}
              className="cardio-page__overlay"
              onClick={() => selectActivity(null)}
              role="dialog"
              aria-modal="true"
              aria-label={detailActivity.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="cardio-page__detail"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <button className="cardio-page__close" onClick={() => selectActivity(null)}>✕</button>
                {detailActivity.imageUrl && (
                  <motion.div
                    className="cardio-page__detail-hero"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <img src={detailActivity.imageUrl} alt={detailActivity.name} />
                  </motion.div>
                )}
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {detailActivity.name}
                </motion.h2>
                <motion.div
                  className="cardio-page__detail-meta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="badge badge--primary">{detailActivity.category}</span>
                  <span className="badge badge--info">{detailActivity.intensityLevel}</span>
                  <span>🔥 {detailActivity.caloriesPerHour} cal/hr</span>
                  <span>⏱ {detailActivity.durationMin} min</span>
                </motion.div>
                <motion.p
                  className="cardio-page__detail-desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {detailActivity.description}
                </motion.p>
                <motion.div
                  className="cardio-page__howto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>🚀 How to Start</h3>
                  <p>{detailActivity.howToStart}</p>
                </motion.div>
                <motion.div
                  className="cardio-page__detail-tags"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {detailActivity.tags.map((t) => (
                    <span key={t} className="cardio-page__tag">{t}</span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
