import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import CardioHub from './pages/CardioHub';
import RoutineBuilder from './pages/RoutineBuilder';
import MyRoutines from './pages/MyRoutines';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/cardio" element={<CardioHub />} />
          <Route path="/routine-builder" element={<RoutineBuilder />} />
          <Route path="/my-routines" element={<MyRoutines />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
