import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.scss';

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {allLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`navbar__mobile-link ${pathname === l.to ? 'navbar__mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="navbar__mobile-auth">
              {isAuthenticated ? (
                <button
                  className="navbar__btn navbar__btn--outline"
                  onClick={() => { dispatch(logout()); setMenuOpen(false); }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="navbar__btn navbar__btn--outline" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="navbar__btn navbar__btn--primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
