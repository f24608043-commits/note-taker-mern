// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) return null;

  return (
    <nav
      className={`py-4 px-6 shadow-md ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
        }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          📝 NoteTaker
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/notes" className="hover:underline hidden md:block">
            Notes
          </Link>
          <Link to="/calendar" className="hover:underline hidden md:block">
            Calendar
          </Link>

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;