const Testimonial = require("../models/Testimonial");

// @desc    Get Approved Testimonials (Public)
// @route   GET /api/testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findApproved();
    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get All Testimonials (Admin)
// @route   GET /api/testimonials/admin
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create Testimonial (Admin)
// @route   POST /api/testimonials
const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve Testimonial (Admin)
// @route   PUT /api/testimonials/:id/approve
const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.approve(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete Testimonial (Admin)
// @route   DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.delete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  approveTestimonial,
  deleteTestimonial,
};
