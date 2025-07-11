import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [interests, setInterests] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get('/api/profile/me');
        if (res.data) {
          setName(res.data.name || '');
          setAbout(res.data.about || '');
          setInterests(res.data.interests ? res.data.interests.join(', ') : '');
          if (res.data.avatar) {
            setAvatarPreview(`/uploads/${res.data.avatar}`);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchProfile();
  }, []);

  // Calculate profile completeness
  const completeness = [name, about, interests, avatar].filter(Boolean).length;
  const percent = (completeness / 4) * 100;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('about', about);
    formData.append('interests', interests);
    if (avatar) formData.append('avatar', avatar);

    try {
      await axios.post('/api/profile', formData);
      toast.success('Profile saved!');
      navigate('/browse');
    } catch (err) {
      toast.error('Profile save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white/90 dark:bg-gray-800 shadow-2xl rounded-3xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-extrabold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent select-none dark:bg-gradient-to-r dark:from-primary-dark dark:to-accent-dark">
          Complete Your Profile
        </h2>
        {/* Profile completeness bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700 dark:text-gray-200">
            <span>Profile Completeness</span>
            <span>{percent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent dark:from-primary-dark dark:to-accent-dark transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 mt-2">
          <div className="flex flex-col items-center gap-2">
            <div className="relative group w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow-xl mb-4 border-4 border-white dark:border-gray-900 transition-all duration-300">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="object-cover w-full h-full rounded-full transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <span className="text-6xl text-white/60">👤</span>
              )}
              <label className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow cursor-pointer hover:bg-primary hover:text-white transition-colors" title="Change photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
              </label>
            </div>
          </div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-primary-light dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
            required
          />
          <textarea
            placeholder="About you..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-3 border border-primary-light dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] dark:bg-gray-900 dark:text-white"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Your interests (comma separated)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full p-3 border border-primary-light dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 active:scale-100 transition-transform disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            disabled={loading}
          >
            {loading ? <span className="loader border-2 border-t-2 border-primary rounded-full w-5 h-5 animate-spin"></span> : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}