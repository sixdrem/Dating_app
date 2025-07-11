import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaUser, FaUsers, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  // Read dark mode from localStorage or system preference
  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-md rounded-b-2xl mb-6 transition-colors">
      <div className="flex items-center gap-3 select-none">
        <span className="text-3xl font-extrabold font-[Poppins,cursive] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          Matchify
        </span>
      </div>
      <div className="flex gap-4 items-center text-lg">
        <button onClick={toggleDark} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Toggle dark mode">
          {dark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
        {token ? (
          <>
            <Link to="/profile" className="flex items-center gap-1 hover:text-primary-dark transition"><FaUser /> <span className="hidden sm:inline">Profile</span></Link>
            <Link to="/browse" className="flex items-center gap-1 hover:text-primary-dark transition"><FaUsers /> <span className="hidden sm:inline">Browse</span></Link>
            <Link to="/matches" className="flex items-center gap-1 hover:text-primary-dark transition"><FaHeart /> <span className="hidden sm:inline">Matches</span></Link>
            <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 font-medium hover:underline"><FaSignOutAlt /> <span className="hidden sm:inline">Logout</span></button>
          </>
        ) : (
          <>
            <Link to="/" className="flex items-center gap-1 hover:text-primary-dark transition"><FaSignInAlt /> <span className="hidden sm:inline">Login</span></Link>
            <Link to="/signup" className="flex items-center gap-1 hover:text-primary-dark transition"><FaUserPlus /> <span className="hidden sm:inline">Signup</span></Link>
          </>
        )}
      </div>
    </nav>
  );
}
