import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRoutines, deleteRoutine } from '../store/routineSlice';
import { motion, AnimatePresence } from 'framer-motion';
import RoutineView from '../components/RoutineView';
import { Link } from 'react-router-dom';
import './MyRoutines.scss';

export default function MyRoutines() {
  const dispatch = useAppDispatch();
  const { routines, loading } = useAppSelector((s) => s.routines);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchRoutines());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="my-routines">
        <motion.div
          className="my-routines__auth-prompt"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>🔒 Login Required</h2>
          <p>Please log in to view your saved routines.</p>
          <Link to="/login" className="my-routines__login-btn">Login</Link>
        </motion.div>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    dispatch(deleteRoutine(id));
  };

  return (
    <div className="my-routines">
      <div className="page-header">
        <h1>My Routines</h1>
        <p>Your saved workout routines</p>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : routines.length === 0 ? (
        <motion.div
          className="my-routines__empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>No routines yet</h2>
          <p>Head to the Routine Builder to create your first personalized workout plan!</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/routine-builder" className="my-routines__build-btn">Build a Routine</Link>
          </motion.div>
        </motion.div>
      ) : (
        <div className="my-routines__list">
          <AnimatePresence>
            {routines.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, height: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                layout
              >
                <RoutineView routine={r} onDelete={handleDelete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
