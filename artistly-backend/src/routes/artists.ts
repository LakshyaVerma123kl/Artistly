import { Router, Request, Response } from "express";
import Artist from "../models/artist";

const router = Router();

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Helper function to check if error has a name property
const getErrorName = (error: unknown): string => {
  if (error instanceof Error) return error.name;
  return "";
};

// Helper function to get validation error messages
const getValidationErrors = (error: unknown): string[] => {
  if (
    error instanceof Error &&
    error.name === "ValidationError" &&
    "errors" in error
  ) {
    const validationError = error as any;
    return Object.values(validationError.errors).map((err: any) => err.message);
  }
  return [];
};

// GET all artists with optional filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    console.log("📥 GET /api/artists - Query params:", req.query);

    const { category, location, priceRange } = req.query;

    // Build filter object
    const filter: any = {};

    if (category && category !== "" && category !== "all") {
      filter.category = { $regex: category, $options: "i" };
      console.log("🏷️ Filtering by category:", category);
    }

    if (location && location !== "" && location !== "all") {
      filter.location = { $regex: location, $options: "i" };
      console.log("📍 Filtering by location:", location);
    }

    if (priceRange && priceRange !== "" && priceRange !== "all") {
      filter.priceRange = { $regex: priceRange, $options: "i" };
      console.log("💰 Filtering by price range:", priceRange);
    }

    console.log("🔍 MongoDB filter:", filter);

    const artists = await Artist.find(filter).lean(); // .lean() for better performance

    console.log(`✅ Found ${artists.length} artists`);
    console.log(
      "📋 Artists data:",
      artists.map((a) => ({ id: a._id, name: a.name }))
    );

    // Ensure we return a proper JSON response
    return res.status(200).json(artists);
  } catch (error) {
    console.error("❌ Error fetching artists:", error);
    return res.status(500).json({
      message: "Failed to fetch artists",
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : undefined,
    });
  }
});

// GET one artist
router.get("/:id", async (req: Request, res: Response) => {
  try {
    console.log(`📥 GET /api/artists/${req.params.id}`);

    const artist = await Artist.findById(req.params.id).lean();

    if (!artist) {
      console.log(`❌ Artist not found: ${req.params.id}`);
      return res.status(404).json({ message: "Artist not found" });
    }

    console.log(`✅ Found artist: ${artist.name}`);
    return res.status(200).json(artist);
  } catch (error) {
    console.error("❌ Error fetching artist:", error);

    // Handle invalid ObjectId
    if (getErrorName(error) === "CastError") {
      return res.status(400).json({ message: "Invalid artist ID format" });
    }

    return res.status(500).json({
      message: "Failed to fetch artist",
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : undefined,
    });
  }
});

// CREATE artist
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("📥 POST /api/artists - Body:", req.body);

    const { name, email, category, priceRange, location, image } = req.body;

    if (!name || !name.trim()) {
      console.log("❌ Validation failed: Name is required");
      return res.status(400).json({ message: "Name is required" });
    }

    const artistData = {
      name: name.trim(),
      email: email?.trim() || "",
      category: category?.trim() || "",
      priceRange: priceRange?.trim() || "",
      location: location?.trim() || "",
      image: image?.trim() || "",
    };

    console.log("➕ Creating artist with data:", artistData);

    const newArtist = new Artist(artistData);
    await newArtist.save();

    console.log(`✅ Created artist: ${newArtist.name} (ID: ${newArtist._id})`);
    return res.status(201).json(newArtist);
  } catch (error) {
    console.error("❌ Error creating artist:", error);

    // Handle validation errors
    if (getErrorName(error) === "ValidationError") {
      const validationErrors = getValidationErrors(error);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    return res.status(500).json({
      message: "Failed to create artist",
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : undefined,
    });
  }
});

// UPDATE artist
router.put("/:id", async (req: Request, res: Response) => {
  try {
    console.log(`📥 PUT /api/artists/${req.params.id} - Body:`, req.body);

    const updated = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      console.log(`❌ Artist not found for update: ${req.params.id}`);
      return res.status(404).json({ message: "Artist not found" });
    }

    console.log(`✅ Updated artist: ${updated.name}`);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating artist:", error);

    // Handle invalid ObjectId
    if (getErrorName(error) === "CastError") {
      return res.status(400).json({ message: "Invalid artist ID format" });
    }

    // Handle validation errors
    if (getErrorName(error) === "ValidationError") {
      const validationErrors = getValidationErrors(error);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    return res.status(500).json({
      message: "Failed to update artist",
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : undefined,
    });
  }
});

// DELETE artist - Fixed to return proper response
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    console.log(`📥 DELETE /api/artists/${req.params.id}`);

    const deleted = await Artist.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      console.log(`❌ Artist not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: "Artist not found" });
    }

    console.log(`✅ Deleted artist: ${deleted.name}`);
    // Return success message instead of empty 204
    return res.status(200).json({
      message: "Artist deleted successfully",
      deletedArtist: {
        id: deleted._id,
        name: deleted.name,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting artist:", error);

    // Handle invalid ObjectId
    if (getErrorName(error) === "CastError") {
      return res.status(400).json({ message: "Invalid artist ID format" });
    }

    return res.status(500).json({
      message: "Failed to delete artist",
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : undefined,
    });
  }
});

export default router;
