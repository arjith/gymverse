import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import './Navbar.scss';

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/exercises', label: 'Exercises' },
    { to: '/cardio', label: 'Cardio Hub' },
    { to: '/routine-builder', label: 'Build Routine' },
  ];

  const authLinks = [
    { to: '/my-routines', label: 'My Routines' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">💪</span>
          <span className="navbar__logo-text">GymVerse</span>
        </Link>

        <div className="navbar__links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated &&
            authLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
        </div>

        <div className="navbar__auth">
          {isAuthenticated ? (
            <>
              <span className="navbar__user">{user?.name}</span>
              <button className="navbar__btn navbar__btn--outline" onClick={() => dispatch(logout())}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__btn navbar__btn--outline">
                Login
              </Link>
              <Link to="/register" className="navbar__btn navbar__btn--primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
