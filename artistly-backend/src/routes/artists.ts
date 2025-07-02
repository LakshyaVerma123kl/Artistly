import { Router, Request, Response } from "express";
import Artist from "../models/artist";

const router = Router();

// GET all artists with optional filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, location, priceRange } = req.query;

    // Build filter object
    const filter: any = {};
    if (category && category !== "")
      filter.category = { $regex: category, $options: "i" };
    if (location && location !== "")
      filter.location = { $regex: location, $options: "i" };
    if (priceRange && priceRange !== "")
      filter.priceRange = { $regex: priceRange, $options: "i" };

    const artists = await Artist.find(filter);
    return res.json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return res.status(500).json({ message: "Failed to fetch artists" });
  }
});

// GET one artist
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    return res.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return res.status(500).json({ message: "Failed to fetch artist" });
  }
});

// CREATE artist
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, category, priceRange, location, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newArtist = new Artist({
      name: name.trim(),
      email: email?.trim(),
      category: category?.trim(),
      priceRange: priceRange?.trim(),
      location: location?.trim(),
      image: image?.trim(),
    });

    await newArtist.save();
    return res.status(201).json(newArtist);
  } catch (error) {
    console.error("Error creating artist:", error);
    return res.status(500).json({ message: "Failed to create artist" });
  }
});

// UPDATE artist
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Artist not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Error updating artist:", error);
    return res.status(500).json({ message: "Failed to update artist" });
  }
});

// DELETE artist - Fixed to return proper response
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Artist.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Return success message instead of empty 204
    return res.json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return res.status(500).json({ message: "Failed to delete artist" });
  }
});

export default router;
