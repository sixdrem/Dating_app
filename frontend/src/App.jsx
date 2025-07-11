// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import Matches from './pages/Matches';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <ProfileProvider>
        <div className="font-sans min-h-screen flex flex-col">
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Navbar />
          <main className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/matches" element={<Matches />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </ProfileProvider>
    </AuthProvider>
  );
}
