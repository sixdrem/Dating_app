// backend/controllers/user.controller.js
import User from '../models/User.js';
import Like from '../models/Like.js';
import Profile from '../models/Profile.js'; // Add this import at the top

// POST /like/:id
export const likeUser = async (req, res) => {
  try {
    const fromUser = req.user.id;
    const toUser = req.params.id;
    if (fromUser === toUser) {
      return res.status(400).json({ message: 'You cannot like yourself.' });
    }
    // Check if already liked
    const existing = await Like.findOne({ fromUser, toUser });
    if (existing) {
      return res.status(400).json({ message: 'Already liked this user.' });
    }
    // Create like
    await Like.create({ fromUser, toUser });
    // Check for mutual like
    const mutual = await Like.findOne({ fromUser: toUser, toUser: fromUser });
    if (mutual) {
      return res.json({ match: true, message: 'It’s a match!' });
    }
    res.json({ match: false, message: 'Liked user.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to like user' });
  }
};

// GET /matches
export const getMatches = async (req, res) => {
  try {
    const myId = req.user.id;
    // Find users I liked
    const likesSent = await Like.find({ fromUser: myId });
    const likedUserIds = likesSent.map(like => like.toUser.toString());
    // Find users who liked me back
    const likedBack = await Like.find({ toUser: myId, fromUser: { $in: likedUserIds } });
    const matchIds = likedBack.map(like => like.fromUser);
    // Get user details for matches
    const users = await User.find({ _id: { $in: matchIds } });

    // Fetch profiles for each matched user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ userId: user._id });
        return {
          _id: user._id,
          email: user.email,
          name: profile?.name || '',
          about: profile?.about || '',
          interests: profile?.interests || [],
          avatar: profile?.avatar || '',
        };
      })
    );

    res.json(usersWithProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
};
