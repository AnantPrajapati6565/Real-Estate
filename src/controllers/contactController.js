// const Contact = require("../src/models/Contact");
const Contact = require("../models/Contact");

// @desc    Submit Contact Form
// @route   POST /api/contacts
const submitContact = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({ fullName, email, subject, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get All Contacts (Admin)
// @route   GET /api/contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Single Contact (Admin)
// @route   GET /api/contacts/:id
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Mark as read
    await Contact.updateStatus(req.params.id, "read");
    const updatedContact = await Contact.findById(req.params.id);

    res.json({
      success: true,
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Contact Status (Admin)
// @route   PUT /api/contacts/:id
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.updateStatus(req.params.id, status);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete Contact (Admin)
// @route   DELETE /api/contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.delete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
