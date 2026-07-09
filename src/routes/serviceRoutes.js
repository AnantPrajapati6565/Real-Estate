const express = require("express");
const router = express.Router();
const {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getServices);
// Admin routes (protected)
router.get("/admin", protect, getAllServicesAdmin);
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;
