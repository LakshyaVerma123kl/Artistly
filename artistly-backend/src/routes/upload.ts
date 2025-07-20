// routes/upload.ts
import { Router, Request, Response } from "express";
import { put } from "@vercel/blob";
import multer from "multer";
import path from "path";

const router = Router();

// Use memory storage for serverless compatibility
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed"));
    }
  },
});

// Upload endpoint
router.post("/", async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large. Maximum size is 5MB",
        });
      }
      return res.status(400).json({
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    try {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(req.file.originalname);
      const filename = `${uniqueSuffix}${extension}`;

      // Upload to Vercel Blob
      const blob = await put(filename, req.file.buffer, {
        access: "public",
      });

      console.log("File uploaded successfully to Vercel Blob:", filename);

      return res.status(200).json({
        message: "File uploaded successfully",
        filename: filename,
        url: blob.url, // This is the full URL you'll store in MongoDB
        path: blob.url, // For compatibility with your existing frontend
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error("Vercel Blob upload error:", error);
      return res.status(500).json({
        message: "Failed to upload file to storage",
      });
    }
  });
});

export default router;
