import { Router, Request, Response } from "express";
import Artist from "../models/artist";

const router = Router();

// GET all artists
router.get("/", async (_req: Request, res: Response) => {
  const artists = await Artist.find();
  return res.json(artists);
});

// GET one artist
router.get("/:id", async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    return res.status(404).json({ message: "Artist not found" });
  }
  return res.json(artist);
});

// CREATE artist
router.post("/", async (req: Request, res: Response) => {
  const { name, email, category, priceRange, location, image } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newArtist = new Artist({
    name,
    email,
    category,
    priceRange,
    location,
    image,
  });
  await newArtist.save();
  return res.status(201).json(newArtist);
});

// UPDATE artist
router.put("/:id", async (req: Request, res: Response) => {
  const updated = await Artist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) {
    return res.status(404).json({ message: "Artist not found" });
  }
  return res.json(updated);
});

// DELETE artist
router.delete("/:id", async (req: Request, res: Response) => {
  const deleted = await Artist.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Artist not found" });
  }
  return res.status(204).send();
});

export default router;
