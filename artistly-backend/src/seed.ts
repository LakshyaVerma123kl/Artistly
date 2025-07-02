import mongoose from "mongoose";
import Artist from "./models/artist";
import data from "./data.json"; // Make sure the path is correct

const seed = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/artistly"); // Change if using Atlas

    // Optional: clear old data
    await Artist.deleteMany();

    // Insert new data
    await Artist.insertMany(data.artists);

    console.log("✅ Seeded artist data successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seed();
