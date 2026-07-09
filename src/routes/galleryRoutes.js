// const express = require("express");
// const router = express.Router();
// const {
//   getGallery,
//   createGalleryItem,
//   deleteGalleryItem,
//   updateGalleryItem,
// } = require("../controllers/galleryController");
// const { protect } = require("../middleware/auth");

// // Public routes
// router.get("/", getGallery);

// // Admin routes (protected)
// router.post("/", protect, createGalleryItem);
// router.put("/:id", protect, updateGalleryItem);
// router.delete("/:id", protect, deleteGalleryItem);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getGallery,
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getGallery);

// Admin routes (protected)
router.post("/", protect, createGalleryItem);
router.put("/:id", protect, updateGalleryItem);
router.delete("/:id", protect, deleteGalleryItem);

module.exports = router;
