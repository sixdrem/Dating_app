import React from 'react';

export default function UserCard({ user, onLike }) {
  return (
    <div className="border p-4 rounded shadow bg-white">
      <img src={user.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="w-full h-40 object-cover rounded mb-2" />
      <h3 className="text-lg font-bold">{user.about || 'No about provided'}</h3>
      <p className="text-sm text-gray-500">{user.interests?.join(', ')}</p>
      {onLike && <button onClick={onLike} className="mt-2 w-full bg-pink-500 text-white py-1 rounded">Like</button>}
    </div>
  );
}
