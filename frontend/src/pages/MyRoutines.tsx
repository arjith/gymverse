import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRoutines, deleteRoutine } from '../store/routineSlice';
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
        <div className="my-routines__auth-prompt">
          <h2>🔒 Login Required</h2>
          <p>Please log in to view your saved routines.</p>
          <Link to="/login" className="my-routines__login-btn">Login</Link>
        </div>
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
        <div className="my-routines__empty">
          <h2>No routines yet</h2>
          <p>Head to the Routine Builder to create your first personalized workout plan!</p>
          <Link to="/routine-builder" className="my-routines__build-btn">Build a Routine</Link>
        </div>
      ) : (
        <div className="my-routines__list">
          {routines.map((r) => (
            <RoutineView key={r.id} routine={r} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
