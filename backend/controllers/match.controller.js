import Like from "../models/Like.js";
import Profile from "../models/Profile.js";

export const getMatches = async (req, res) => {
  const likesSent = await Like.find({ fromUser: req.user.id });
  const likedUserIds = likesSent.map(like => like.toUser.toString());
  const likedBack = await Like.find({ toUser: req.user.id, fromUser: { $in: likedUserIds } });
  const matchIds = likedBack.map(like => like.fromUser);
  const profiles = await Profile.find({ userId: { $in: matchIds } });
  res.json(profiles);
};