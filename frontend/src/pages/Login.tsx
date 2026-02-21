import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/authSlice';
import './Auth.scss';

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
      <form className="auth-page__form" onSubmit={handleSubmit}>
        <h1 className="auth-page__title">Welcome Back</h1>
        <p className="auth-page__subtitle">Log in to your GymVerse account</p>

        {error && <div className="error-message">{error}</div>}

        <div className="auth-page__field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); dispatch(clearError()); }}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="auth-page__field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); dispatch(clearError()); }}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="auth-page__submit" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-page__switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>

        <p className="auth-page__demo">
          Demo: demo@gymverse.com / password123
        </p>
      </form>
    </div>
  );
}
