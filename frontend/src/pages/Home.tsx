import { Link } from 'react-router-dom';
import './Home.scss';

const features = [
  {
    title: 'Exercise Library',
    desc: '60+ exercises with animated demos and alternate options for every move',
    to: '/exercises',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=250&fit=crop&q=80',
  },
  {
    title: 'Fun Cardio Hub',
    desc: '35+ cardio activities — from dance to trampoline to parkour',
    to: '/cardio',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop&q=80',
  },
  {
    title: 'Routine Builder',
    desc: 'Goal-powered routines tailored to your fitness ambitions',
    to: '/routine-builder',
    img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=250&fit=crop&q=80',
  },
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

const HERO_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&h=600&fit=crop&q=80';

export default function Home() {
  return (
    <div className="home">
      <section className="home__hero">
        <img src={HERO_IMG} alt="" className="home__hero-bg" aria-hidden="true" />
        <div className="home__hero-content">
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
        </div>
      </section>

      <section className="home__features">
        {features.map((f, i) => (
          <Link
            to={f.to}
            key={f.title}
            className="home__feature"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="home__feature-img-wrap">
              <img src={f.img} alt="" className="home__feature-img" loading="lazy" />
            </div>
            <div className="home__feature-body">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
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
