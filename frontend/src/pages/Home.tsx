import { Link } from 'react-router-dom';
import './Home.scss';

const features = [
  { emoji: '🏋️', title: 'Exercise Library', desc: '60+ exercises with alternate options for every move', to: '/exercises' },
  { emoji: '🎉', title: 'Fun Cardio Hub', desc: '35+ cardio activities from dance to trampoline to parkour', to: '/cardio' },
  { emoji: '🎯', title: 'Routine Builder', desc: 'AI-powered routines tailored to your fitness goals', to: '/routine-builder' },
];

const goals = [
  { emoji: '🔥', label: 'Weight Loss' },
  { emoji: '💪', label: 'Muscle Building' },
  { emoji: '🏃', label: 'Endurance' },
  { emoji: '🧘', label: 'Flexibility' },
  { emoji: '⚡', label: 'General Fitness' },
  { emoji: '🏆', label: 'Athletic Performance' },
  { emoji: '🧘‍♂️', label: 'Stress Relief' },
];

export default function Home() {
  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__title">
          Your Fitness <span>Universe</span>
        </h1>
        <p className="home__subtitle">
          Discover exercises, explore fun cardio, and build personalized routines
          based on your fitness goals.
        </p>
        <div className="home__cta">
          <Link to="/routine-builder" className="home__btn home__btn--primary">
            Build My Routine
          </Link>
          <Link to="/exercises" className="home__btn home__btn--outline">
            Explore Exercises
          </Link>
        </div>
      </section>

      <section className="home__features">
        {features.map((f) => (
          <Link to={f.to} key={f.title} className="home__feature">
            <span className="home__feature-emoji">{f.emoji}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </Link>
        ))}
      </section>

      <section className="home__goals">
        <h2>Train for Any Goal</h2>
        <div className="home__goals-grid">
          {goals.map((g) => (
            <Link to="/routine-builder" key={g.label} className="home__goal">
              <span>{g.emoji}</span>
              <span>{g.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
