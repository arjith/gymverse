import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import CardioHub from './pages/CardioHub';
import RoutineBuilder from './pages/RoutineBuilder';
import MyRoutines from './pages/MyRoutines';
import Login from './pages/Login';
import Register from './pages/Register';
import PageTransition from './components/PageTransition';

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/exercises" element={<PageTransition><Exercises /></PageTransition>} />
            <Route path="/cardio" element={<PageTransition><CardioHub /></PageTransition>} />
            <Route path="/routine-builder" element={<PageTransition><RoutineBuilder /></PageTransition>} />
            <Route path="/my-routines" element={<PageTransition><MyRoutines /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
