import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import FloatingParticles from '../components/FloatingParticles';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import './Home.scss';

const features = [
  {
    title: 'Exercise Library',
    desc: '60+ exercises with animated demos and alternate options for every move',
    to: '/exercises',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=250&fit=crop&q=80',
    icon: '🏋️',
  },
  {
    title: 'Fun Cardio Hub',
    desc: '35+ cardio activities — from dance to trampoline to parkour',
    to: '/cardio',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop&q=80',
    icon: '💃',
  },
  {
    title: 'Routine Builder',
    desc: 'Goal-powered routines tailored to your fitness ambitions',
    to: '/routine-builder',
    img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=250&fit=crop&q=80',
    icon: '⚙️',
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

const stats = [
  { value: 64, suffix: '+', label: 'Exercises' },
  { value: 37, suffix: '+', label: 'Cardio Activities' },
  { value: 7, suffix: '', label: 'Goal Types' },
  { value: 8, suffix: '', label: 'Muscle Groups' },
];

const HERO_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&h=600&fit=crop&q=80';

export default function Home() {
  return (
    <div className="home">
      <section className="home__hero">
        <img src={HERO_IMG} alt="" className="home__hero-bg" aria-hidden="true" />
        <div className="home__hero-overlay" aria-hidden="true" />
        <FloatingParticles count={15} />
        <div className="home__hero-content">
          <motion.h1
            className="home__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Your Fitness <span>Universe</span>
          </motion.h1>
          <motion.p
            className="home__subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Discover exercises, explore fun cardio, and build personalized routines
            based on your fitness goals.
          </motion.p>
          <motion.div
            className="home__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/routine-builder" className="home__btn home__btn--primary">
              Build My Routine
            </Link>
            <Link to="/exercises" className="home__btn home__btn--outline">
              Explore Exercises
            </Link>
          </motion.div>
        </div>
      </section>

      <ScrollReveal>
        <section className="home__stats">
          {stats.map((s) => (
            <div key={s.label} className="home__stat">
              <AnimatedCounter value={s.value} suffix={s.suffix} className="home__stat-num" />
              <span className="home__stat-label">{s.label}</span>
            </div>
          ))}
        </section>
      </ScrollReveal>

      <StaggerContainer className="home__features">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <Link to={f.to} className="home__feature">
              <div className="home__feature-img-wrap">
                <img src={f.img} alt="" className="home__feature-img" loading="lazy" />
                <div className="home__feature-icon">{f.icon}</div>
              </div>
              <div className="home__feature-body">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="home__feature-arrow">→</span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <ScrollReveal>
        <section className="home__goals">
          <h2>Train for Any Goal</h2>
          <StaggerContainer className="home__goals-grid">
            {goals.map((g) => (
              <StaggerItem key={g.label}>
                <Link to="/routine-builder" className="home__goal">
                  <motion.span
                    className="home__goal-emoji"
                    whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {g.emoji}
                  </motion.span>
                  <span>{g.label}</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </ScrollReveal>
    </div>
  );
}
