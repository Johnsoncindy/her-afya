import express from "express";
import {
  addHealthArticle,
  getHealthArticles,
  updateHealthArticle,
  deleteHealthArticle,
} from "../controllers/resources";

const router = express.Router();

// Get all health articles/resources
router.get("/health-articles", getHealthArticles);

// Add new health article/resource
router.post("/create-article", addHealthArticle);

// Update a health article/resource
router.put("/update-article/:id", updateHealthArticle);

// Delete a health article/resource
router.delete("/delete-article/:id", deleteHealthArticle);

export default router;
