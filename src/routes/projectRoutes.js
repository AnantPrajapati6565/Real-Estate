// const express = require("express");
// const router = express.Router();
// const {
//   getProjects,
//   getProjectById,
//   createProject,
//   updateProject,
//   deleteProject,
// } = require("../controllers/projectController");
// const { protect } = require("../middleware/auth");

// router.get("/", getProjects);
// router.get("/:id", getProjectById);
// router.post("/", protect, createProject);
// router.put("/:id", protect, updateProject);
// router.delete("/:id", protect, deleteProject);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createProject,
  updateProject,
  getProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin routes with image upload
router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
