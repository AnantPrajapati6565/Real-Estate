const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

// Protected route – only admin can access
router.get("/stats", protect, getDashboardStats);

module.exports = router;
