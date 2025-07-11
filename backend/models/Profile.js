import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: String,
  avatar: String,
  about: String,
  interests: [String],
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);