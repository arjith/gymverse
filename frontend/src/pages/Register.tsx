import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/authSlice';
import './Auth.scss';

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ email, password, name }));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-page__form" onSubmit={handleSubmit}>
        <h1 className="auth-page__title">Join GymVerse</h1>
        <p className="auth-page__subtitle">Create your free account</p>

        {error && <div className="error-message">{error}</div>}

        <div className="auth-page__field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); dispatch(clearError()); }}
            placeholder="Your name"
            required
          />
        </div>

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
            minLength={6}
          />
        </div>

        <button className="auth-page__submit" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="auth-page__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
