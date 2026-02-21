import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { previewRoutine, generateRoutine, clearPreview } from '../store/routineSlice';
import { motion, AnimatePresence } from 'framer-motion';
import GoalSelector from '../components/GoalSelector';
import RoutineView from '../components/RoutineView';
import { FitnessGoal, FitnessLevel, Equipment, GenerateRoutineRequest } from '../types';
import './RoutineBuilder.scss';

const equipmentOptions: Equipment[] = ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'resistance-band'];

const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

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
          <motion.div
            key={s}
            className={`builder-page__step ${step >= s ? 'builder-page__step--active' : ''}`}
            animate={step >= s ? { scale: [1, 1.2, 1], borderColor: '#9EFD38' } : {}}
            transition={{ duration: 0.3 }}
          >
            {s}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className="builder-page__section"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <GoalSelector selected={goal} onSelect={(g) => { setGoal(g); setStep(2); }} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            className="builder-page__section"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <h2 className="builder-page__section-title">Customize Your Plan</h2>

            <div className="builder-page__form">
              <motion.div
                className="builder-page__field"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label>Days per Week</label>
                <div className="builder-page__days">
                  {[3, 4, 5, 6].map((d) => (
                    <motion.button
                      key={d}
                      className={`builder-page__day-btn ${daysPerWeek === d ? 'builder-page__day-btn--active' : ''}`}
                      onClick={() => setDaysPerWeek(d)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {d} days
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="builder-page__field"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label>Session Duration: {sessionDuration} min</label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="15"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                />
              </motion.div>

              <motion.div
                className="builder-page__field"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label>Fitness Level</label>
                <div className="builder-page__levels">
                  {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((l) => (
                    <motion.button
                      key={l}
                      className={`builder-page__level-btn ${fitnessLevel === l ? 'builder-page__level-btn--active' : ''}`}
                      onClick={() => setFitnessLevel(l)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {l}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="builder-page__field"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label>Available Equipment</label>
                <div className="builder-page__equip">
                  {equipmentOptions.map((eq) => (
                    <motion.button
                      key={eq}
                      className={`builder-page__equip-btn ${equipment.includes(eq) ? 'builder-page__equip-btn--active' : ''}`}
                      onClick={() => toggleEquipment(eq)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {eq}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.button
                className="builder-page__gen-btn"
                onClick={handlePreview}
                disabled={!goal || equipment.length === 0}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Preview Routine
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            className="builder-page__section"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            {loading ? (
              <div className="loading-container"><div className="spinner" /></div>
            ) : preview ? (
              <>
                <RoutineView routine={preview} />
                <motion.div
                  className="builder-page__actions"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    className="builder-page__action-btn builder-page__action-btn--outline"
                    onClick={() => setStep(2)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Adjust
                  </motion.button>
                  <motion.button
                    className="builder-page__action-btn builder-page__action-btn--outline"
                    onClick={handlePreview}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 Regenerate
                  </motion.button>
                  {isAuthenticated ? (
                    <motion.button
                      className="builder-page__action-btn builder-page__action-btn--primary"
                      onClick={handleSave}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      💾 Save Routine
                    </motion.button>
                  ) : (
                    <span className="builder-page__login-hint">Log in to save your routine</span>
                  )}
                </motion.div>
              </>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : null}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            className="builder-page__section builder-page__done"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              🎉 Routine Saved!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your personalized routine has been created and saved.
            </motion.p>
            <motion.button
              className="builder-page__gen-btn"
              onClick={handleReset}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Build Another Routine
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
