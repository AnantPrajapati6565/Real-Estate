const Project = require("../models/Project");

const getProjects = async (req, res) => {
  try {
    const { status, category } = req.query;
    const projects = await Project.findAll({ status, category });
    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create Project (Admin)
// @route   POST /api/projects
// const createProject = async (req, res) => {
//   try {
//     const project = await Project.create(req.body);
//     res.status(201).json({
//       success: true,
//       data: project,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// @desc    Update Project (Admin)
// @route   PUT /api/projects/:id
// const updateProject = async (req, res) => {
//   try {
//     const project = await Project.update(req.params.id, req.body);
//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found",
//       });
//     }
//     res.json({
//       success: true,
//       data: project,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ... other functions remain unchanged

const createProject = async (req, res) => {
  try {
    // Multer populates req.body (text fields) and req.file (the image)
    // Parse 'features' if it's a JSON string
    let features = [];
    if (req.body.features) {
      try {
        features = JSON.parse(req.body.features);
      } catch (e) {
        features = req.body.features.split(",").map((f) => f.trim());
      }
    }

    const projectData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      location: req.body.location,
      image: req.file ? req.file.path : req.body.image || "",
      status: req.body.status || "available",
      category: req.body.category || "residential",
      features: features,
      bedrooms: parseInt(req.body.bedrooms) || null,
      bathrooms: parseInt(req.body.bathrooms) || null,
      area: req.body.area || "",
    };

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    let features = [];
    if (req.body.features) {
      try {
        features = JSON.parse(req.body.features);
      } catch (e) {
        features = req.body.features.split(",").map((f) => f.trim());
      }
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      location: req.body.location,
      status: req.body.status,
      category: req.body.category,
      features: features,
      bedrooms: parseInt(req.body.bedrooms) || null,
      bathrooms: parseInt(req.body.bathrooms) || null,
      area: req.body.area || "",
    };

    // If a new image was uploaded, use its path; otherwise keep the existing one if sent
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.existingImage) {
      updateData.image = req.body.existingImage;
    }

    const project = await Project.update(req.params.id, updateData);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// deleteProject remains the same

// @desc    Delete Project (Admin)
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.delete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
