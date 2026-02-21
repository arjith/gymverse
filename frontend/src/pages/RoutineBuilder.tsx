import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { previewRoutine, generateRoutine, clearPreview } from '../store/routineSlice';
import GoalSelector from '../components/GoalSelector';
import RoutineView from '../components/RoutineView';
import { FitnessGoal, FitnessLevel, Equipment, GenerateRoutineRequest } from '../types';
import './RoutineBuilder.scss';

const equipmentOptions: Equipment[] = ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'resistance-band'];

export default function RoutineBuilder() {
  const dispatch = useAppDispatch();
  const { previewRoutine: preview, loading, error } = useAppSelector((s) => s.routines);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<FitnessGoal | ''>('');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('intermediate');
  const [equipment, setEquipment] = useState<Equipment[]>(['barbell', 'dumbbell', 'bodyweight']);

  const toggleEquipment = (eq: Equipment) => {
    setEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  const buildRequest = (): GenerateRoutineRequest => ({
    goal: goal as FitnessGoal,
    daysPerWeek,
    sessionDurationMin: sessionDuration,
    fitnessLevel,
    availableEquipment: equipment,
  });

  const handlePreview = () => {
    if (!goal) return;
    dispatch(previewRoutine(buildRequest()));
    setStep(3);
  };

  const handleSave = () => {
    if (!goal) return;
    dispatch(generateRoutine(buildRequest()));
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setGoal('');
    dispatch(clearPreview());
  };

  return (
    <div className="builder-page">
      <div className="page-header">
        <h1>🎯 Routine Builder</h1>
        <p>Build a custom routine tailored to your fitness goals</p>
      </div>

      <div className="builder-page__steps">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`builder-page__step ${step >= s ? 'builder-page__step--active' : ''}`}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="builder-page__section">
          <GoalSelector selected={goal} onSelect={(g) => { setGoal(g); setStep(2); }} />
        </div>
      )}

      {step === 2 && (
        <div className="builder-page__section">
          <h2 className="builder-page__section-title">Customize Your Plan</h2>

          <div className="builder-page__form">
            <div className="builder-page__field">
              <label>Days per Week</label>
              <div className="builder-page__days">
                {[3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    className={`builder-page__day-btn ${daysPerWeek === d ? 'builder-page__day-btn--active' : ''}`}
                    onClick={() => setDaysPerWeek(d)}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-page__field">
              <label>Session Duration: {sessionDuration} min</label>
              <input
                type="range"
                min="30"
                max="120"
                step="15"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value))}
              />
            </div>

            <div className="builder-page__field">
              <label>Fitness Level</label>
              <div className="builder-page__levels">
                {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((l) => (
                  <button
                    key={l}
                    className={`builder-page__level-btn ${fitnessLevel === l ? 'builder-page__level-btn--active' : ''}`}
                    onClick={() => setFitnessLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-page__field">
              <label>Available Equipment</label>
              <div className="builder-page__equip">
                {equipmentOptions.map((eq) => (
                  <button
                    key={eq}
                    className={`builder-page__equip-btn ${equipment.includes(eq) ? 'builder-page__equip-btn--active' : ''}`}
                    onClick={() => toggleEquipment(eq)}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>

            <button className="builder-page__gen-btn" onClick={handlePreview} disabled={!goal || equipment.length === 0}>
              Preview Routine
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="builder-page__section">
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : preview ? (
            <>
              <RoutineView routine={preview} />
              <div className="builder-page__actions">
                <button className="builder-page__action-btn builder-page__action-btn--outline" onClick={() => setStep(2)}>
                  ← Adjust
                </button>
                <button className="builder-page__action-btn builder-page__action-btn--outline" onClick={handlePreview}>
                  🔄 Regenerate
                </button>
                {isAuthenticated ? (
                  <button className="builder-page__action-btn builder-page__action-btn--primary" onClick={handleSave}>
                    💾 Save Routine
                  </button>
                ) : (
                  <span className="builder-page__login-hint">Log in to save your routine</span>
                )}
              </div>
            </>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : null}
        </div>
      )}

      {step === 4 && (
        <div className="builder-page__section builder-page__done">
          <h2>🎉 Routine Saved!</h2>
          <p>Your personalized routine has been created and saved.</p>
          <button className="builder-page__gen-btn" onClick={handleReset}>
            Build Another Routine
          </button>
        </div>
      )}
    </div>
  );
}
