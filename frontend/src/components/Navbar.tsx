import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { motion } from 'framer-motion';
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

  const allLinks = isAuthenticated ? [...links, ...authLinks] : links;

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <motion.span
            className="navbar__logo-icon"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            💪
          </motion.span>
          <span className="navbar__logo-text">GymVerse</span>
        </Link>

        <div className="navbar__links">
          {allLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}
            >
              {l.label}
              {pathname === l.to && (
                <motion.span
                  className="navbar__link-indicator"
                  layoutId="navbar-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="navbar__auth">
          {isAuthenticated ? (
            <>
              <span className="navbar__user">{user?.name}</span>
              <motion.button
                className="navbar__btn navbar__btn--outline"
                onClick={() => dispatch(logout())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
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
