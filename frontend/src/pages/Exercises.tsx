import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExercises, fetchExerciseDetail, setFilters, clearSelection } from '../store/exerciseSlice';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseCard from '../components/ExerciseCard';
import ExercisePlayer from '../components/ExercisePlayer';
import ScrollReveal from '../components/ScrollReveal';
import { Exercise } from '../types';
import './Exercises.scss';

const muscleGroups = ['', 'chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'glutes', 'full-body'];
const equipmentList = ['', 'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'resistance-band'];
const difficulties = ['', 'beginner', 'intermediate', 'advanced'];

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
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

export default function Exercises() {
  const dispatch = useAppDispatch();
  const { exercises, selectedExercise, alternates, loading, filters } = useAppSelector((s) => s.exercises);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (detailOpen) {
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeDetail();
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [detailOpen]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.muscleGroup) params.muscleGroup = filters.muscleGroup;
    if (filters.equipment) params.equipment = filters.equipment;
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.search) params.search = filters.search;
    dispatch(fetchExercises(params));
  }, [dispatch, filters]);

  const handleSelect = (e: Exercise) => {
    dispatch(fetchExerciseDetail(e.id));
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    dispatch(clearSelection());
  };

  return (
    <div className="exercises-page">
      <div className="page-header">
        <h1>Exercise Library</h1>
        <p>60+ exercises with alternate options for every move</p>
      </div>

      <motion.div
        className="exercises-page__filters"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Search exercises..."
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
        />
        <select value={filters.muscleGroup} onChange={(e) => dispatch(setFilters({ muscleGroup: e.target.value }))}>
          {muscleGroups.map((m) => (
            <option key={m} value={m}>{m || 'All Muscles'}</option>
          ))}
        </select>
        <select value={filters.equipment} onChange={(e) => dispatch(setFilters({ equipment: e.target.value }))}>
          {equipmentList.map((eq) => (
            <option key={eq} value={eq}>{eq || 'All Equipment'}</option>
          ))}
        </select>
        <select value={filters.difficulty} onChange={(e) => dispatch(setFilters({ difficulty: e.target.value }))}>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d || 'All Levels'}</option>
          ))}
        </select>
      </motion.div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <motion.div
          className="exercises-page__grid"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          key={JSON.stringify(filters)}
        >
          {exercises.map((ex) => (
            <motion.div key={ex.id} variants={gridItemVariants}>
              <ExerciseCard exercise={ex} onSelect={handleSelect} />
            </motion.div>
          ))}
          {exercises.length === 0 && (
            <motion.p
              className="exercises-page__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No exercises match your filters.
            </motion.p>
          )}
        </motion.div>
      )}

      {createPortal(
        <AnimatePresence mode="wait">
          {detailOpen && selectedExercise && (
            <motion.div
              key={selectedExercise.id}
              className="exercises-page__overlay"
              onClick={closeDetail}
              role="dialog"
              aria-modal="true"
              aria-label={selectedExercise.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="exercises-page__detail"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <button className="exercises-page__close" onClick={closeDetail}>✕</button>

                {selectedExercise.imageUrls?.length > 0 && (
                  <motion.div
                    className="exercises-page__gallery"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <ExercisePlayer
                      images={selectedExercise.imageUrls}
                      exerciseName={selectedExercise.name}
                      muscleGroup={selectedExercise.muscleGroup}
                      size="lg"
                    />
                  </motion.div>
                )}

                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedExercise.name}
                </motion.h2>
                <motion.div
                  className="exercises-page__detail-meta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <span className="badge badge--primary">{selectedExercise.muscleGroup}</span>
                  <span className="badge badge--info">{selectedExercise.equipment}</span>
                  <span className="badge badge--warn">{selectedExercise.difficulty}</span>
                </motion.div>

                <motion.div
                  className="exercises-page__instructions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>How to Perform</h3>
                  <ol>
                    {selectedExercise.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </motion.div>

                {selectedExercise.tips.length > 0 && (
                  <motion.div
                    className="exercises-page__tips"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <h3>💡 Tips</h3>
                    <ul>
                      {selectedExercise.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {alternates.length > 0 && (
                  <ScrollReveal delay={0.1}>
                    <div className="exercises-page__alternates">
                      <h3>🔄 Alternate Exercises</h3>
                      <div className="exercises-page__alt-grid">
                        {alternates.map((alt) => (
                          <ExerciseCard key={alt.id} exercise={alt} onSelect={handleSelect} compact />
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
