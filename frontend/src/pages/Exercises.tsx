import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExercises, fetchExerciseDetail, setFilters, clearSelection } from '../store/exerciseSlice';
import ExerciseCard from '../components/ExerciseCard';
import { Exercise } from '../types';
import './Exercises.scss';

const muscleGroups = ['', 'chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'glutes', 'full-body'];
const equipmentList = ['', 'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'resistance-band'];
const difficulties = ['', 'beginner', 'intermediate', 'advanced'];

export default function Exercises() {
  const dispatch = useAppDispatch();
  const { exercises, selectedExercise, alternates, loading, filters } = useAppSelector((s) => s.exercises);
  const [detailOpen, setDetailOpen] = useState(false);

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

      <div className="exercises-page__filters">
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
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <div className="exercises-page__grid">
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onSelect={handleSelect} />
          ))}
          {exercises.length === 0 && <p className="exercises-page__empty">No exercises match your filters.</p>}
        </div>
      )}

      {detailOpen && selectedExercise && (
        <div className="exercises-page__overlay" onClick={closeDetail}>
          <div className="exercises-page__detail" onClick={(e) => e.stopPropagation()}>
            <button className="exercises-page__close" onClick={closeDetail}>✕</button>
            <h2>{selectedExercise.name}</h2>
            <div className="exercises-page__detail-meta">
              <span className="badge badge--primary">{selectedExercise.muscleGroup}</span>
              <span className="badge badge--info">{selectedExercise.equipment}</span>
              <span className="badge badge--warn">{selectedExercise.difficulty}</span>
            </div>

            <div className="exercises-page__instructions">
              <h3>How to Perform</h3>
              <ol>
                {selectedExercise.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            {selectedExercise.tips.length > 0 && (
              <div className="exercises-page__tips">
                <h3>💡 Tips</h3>
                <ul>
                  {selectedExercise.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {alternates.length > 0 && (
              <div className="exercises-page__alternates">
                <h3>🔄 Alternate Exercises</h3>
                <div className="exercises-page__alt-grid">
                  {alternates.map((alt) => (
                    <ExerciseCard key={alt.id} exercise={alt} onSelect={handleSelect} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
