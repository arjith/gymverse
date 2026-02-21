import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/authSlice';
import { motion } from 'framer-motion';
import './Auth.scss';

const formVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const, staggerChildren: 0.08, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <motion.form
        className="auth-page__form"
        onSubmit={handleSubmit}
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="auth-page__title" variants={itemVariants}>Welcome Back</motion.h1>
        <motion.p className="auth-page__subtitle" variants={itemVariants}>Log in to your GymVerse account</motion.p>

        {error && <motion.div className="error-message" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>{error}</motion.div>}

        <motion.div className="auth-page__field" variants={itemVariants}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); dispatch(clearError()); }}
            placeholder="you@example.com"
            required
          />
        </motion.div>

        <motion.div className="auth-page__field" variants={itemVariants}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); dispatch(clearError()); }}
            placeholder="••••••••"
            required
          />
        </motion.div>

        <motion.button
          className="auth-page__submit"
          type="submit"
          disabled={loading}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>

        <motion.p className="auth-page__switch" variants={itemVariants}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </motion.p>

        <motion.p className="auth-page__demo" variants={itemVariants}>
          Demo: demo@gymverse.com / password123
        </motion.p>
      </motion.form>
    </div>
  );
}
