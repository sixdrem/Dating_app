import Profile from "../models/Profile.js";

export const getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id });
  res.json(profile || {});
};


export const updateMyProfile = async (req, res) => {
    console.log('In updateMyProfile, req.user:', req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }
    const { name, about, interests } = req.body;
    const avatar = req.file?.filename;
    // Parse interests if sent as comma-separated string
    let interestsArr = interests;
    if (typeof interests === 'string') {
      interestsArr = interests.split(',').map(i => i.trim()).filter(Boolean);
    }
    const update = {
      ...(name && { name }),
      ...(about && { about }),
      ...(interestsArr && { interests: interestsArr }),
      ...(avatar && { avatar }),
      userId: req.user.id
    };
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      update,
      { upsert: true, new: true }
    );
    res.json(profile);
};