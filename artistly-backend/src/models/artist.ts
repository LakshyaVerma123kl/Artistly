import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    category: { type: String },
    priceRange: { type: String },
    location: { type: String },
    image: { type: String }, // /uploads/filename.jpg
  },
  { timestamps: true }
);

export default mongoose.model("Artist", artistSchema);
