const Service = require("../models/Service");

// @desc    Get All Services (Public)
// @route   GET /api/services
const getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get All Services (Admin)
// @route   GET /api/services/admin
const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.findAllAdmin();
    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create Service (Admin)
// @route   POST /api/services
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Service (Admin)
// @route   PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.update(req.params.id, req.body);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete Service (Admin)
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.delete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
};
