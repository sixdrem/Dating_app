import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaMusic, FaPlane, FaDumbbell, FaBook, FaFilm, FaUtensils, FaGamepad, FaPaw, FaGlobe } from 'react-icons/fa';
import toast from 'react-hot-toast';

const interestIcons = {
  music: <FaMusic className="inline-block mr-1 text-primary" />,
  travel: <FaPlane className="inline-block mr-1 text-primary" />,
  fitness: <FaDumbbell className="inline-block mr-1 text-primary" />,
  reading: <FaBook className="inline-block mr-1 text-primary" />,
  movies: <FaFilm className="inline-block mr-1 text-primary" />,
  food: <FaUtensils className="inline-block mr-1 text-primary" />,
  gaming: <FaGamepad className="inline-block mr-1 text-primary" />,
  pets: <FaPaw className="inline-block mr-1 text-primary" />,
  culture: <FaGlobe className="inline-block mr-1 text-primary" />,
};

function getInterestIcon(interest) {
  const key = interest.toLowerCase();
  return interestIcons[key] || null;
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/matches').then(res => {
      setMatches(res.data);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load matches');
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent select-none">
        Your Matches
      </h2>
      {loading ? (
        <div className="text-center text-lg text-gray-500 py-10">Loading...</div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="100" rx="40" ry="10" fill="#fbc2eb"/>
            <path d="M60 90s-30-24-30-46A15 15 0 0160 30a15 15 0 0130 14c0 22-30 46-30 46z" fill="#ff9a9e"/>
            <circle cx="60" cy="50" r="6" fill="#fff"/>
            <circle cx="75" cy="50" r="6" fill="#fff"/>
            <ellipse cx="67.5" cy="60" rx="7.5" ry="4" fill="#fff"/>
          </svg>
          <p className="text-center text-gray-600 mt-4">No matches yet. Start liking profiles!</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {matches.map((match) => (
            <div key={match._id} className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow mb-2">
                {match.avatar ? (
                  <img src={`/uploads/${match.avatar}`} alt="avatar" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-4xl text-white/60">👤</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-center dark:text-white">{match.name || 'No name'}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center flex items-center justify-center gap-2">
                <FaGlobe className="inline-block text-primary mr-1" />
                {match.about || 'No about provided'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {match.interests && match.interests.length > 0 ? (
                  match.interests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary-light text-primary-dark dark:bg-gray-700 dark:text-primary-light rounded-full text-xs font-semibold flex items-center gap-1">
                      {getInterestIcon(interest)}{interest}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No interests</span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 text-pink-500 font-bold text-lg">
                <FaHeart /> It's a match!
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}