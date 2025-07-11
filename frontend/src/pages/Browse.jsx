import React, { useEffect, useState, useRef } from 'react';
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

export default function Browse() {
  const [users, setUsers] = useState([]);
  const [removing, setRemoving] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;
  const topRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/users?page=${page}&limit=${limit}`).then(res => {
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setLoading(false);
      // Scroll to top of user list on page change
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }).catch(() => {
      toast.error('Error fetching users');
      setLoading(false);
    });
  }, [page]);

  const handleLike = async (id) => {
    try {
      setRemoving((prev) => ({ ...prev, [id]: true }));
      await axios.post(`/api/like/${id}`);
      toast.success('Liked!');
      setTimeout(() => {
        setUsers(users => users.filter(u => u._id !== id));
        setRemoving((prev) => ({ ...prev, [id]: false }));
      }, 400);
    } catch {
      toast.error('Error liking user');
      setRemoving((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div ref={topRef}></div>
      <h2 className="text-2xl font-extrabold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent select-none">
        Browse Profiles
      </h2>
      {loading ? (
        <div className="text-center text-lg text-gray-500 py-10">Loading...</div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="100" rx="40" ry="10" fill="#fbc2eb"/>
            <path d="M60 90s-30-24-30-46A15 15 0 0160 30a15 15 0 0130 14c0 22-30 46-30 46z" fill="#ff9a9e"/>
            <circle cx="60" cy="50" r="6" fill="#fff"/>
            <circle cx="75" cy="50" r="6" fill="#fff"/>
            <ellipse cx="67.5" cy="60" rx="7.5" ry="4" fill="#fff"/>
          </svg>
          <p className="text-center text-gray-600 mt-4">No users left to browse.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
            {users.map((u) => (
              <div
                key={u._id}
                className={`bg-white/90 dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3 transition-all duration-400 ${removing[u._id] ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow mb-2">
                  {u.avatar ? (
                    <img src={`/uploads/${u.avatar}`} alt="avatar" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-4xl text-white/60">👤</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-center dark:text-white">{u.name || 'No name'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center flex items-center justify-center gap-2">
                  <FaGlobe className="inline-block text-primary mr-1" />
                  {u.about || 'No about provided'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {u.interests && u.interests.length > 0 ? (
                    u.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary-light text-primary-dark dark:bg-gray-700 dark:text-primary-light rounded-full text-xs font-semibold flex items-center gap-1">
                        {getInterestIcon(interest)}{interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No interests</span>
                  )}
                </div>
                <button
                  onClick={() => handleLike(u._id)}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white py-2 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                  disabled={removing[u._id]}
                >
                  <FaHeart className="text-pink-500" /> Like
                </button>
              </div>
            ))}
          </div>
          {/* Enhanced Pagination Controls */}
          <div className="flex flex-col items-center mt-6">
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-2 rounded ${page === idx + 1 ? 'bg-accent text-white font-bold underline' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
