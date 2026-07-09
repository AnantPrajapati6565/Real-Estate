const Gallery = require("../models/Gallery");

// @desc    Get all gallery items (Public)
// @route   GET /api/gallery
const getGallery = async (req, res) => {
  try {
    const { category, type } = req.query;
    let items = await Gallery.findAll();

    // Filter by category if provided
    if (category) {
      items = items.filter((item) => item.category === category);
    }

    // Filter by type if provided
    if (type) {
      items = items.filter((item) => item.type === type);
    }

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create gallery item (Admin)
// @route   POST /api/gallery
const createGalleryItem = async (req, res) => {
  try {
    const { title, image_url, category, type, description } = req.body;

    const item = await Gallery.create({
      title,
      image_url,
      category: category || "residential",
      type: type || "image",
      description: description || "",
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete gallery item (Admin)
// @route   DELETE /api/gallery/:id
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.delete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update gallery item (Admin)
// @route   PUT /api/gallery/:id
const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getGallery,
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
};

// const Gallery = require("../models/Gallery");

// // @desc    Get all gallery items (Public)
// // @route   GET /api/gallery
// const getGallery = async (req, res) => {
//   try {
//     const { category, type } = req.query;
//     let items;

//     if (category) {
//       items = await Gallery.findByCategory(category);
//     } else {
//       items = await Gallery.findAll();
//     }

//     // Filter by type if provided
//     if (type) {
//       items = items.filter((item) => item.type === type);
//     }

//     res.json({
//       success: true,
//       count: items.length,
//       data: items,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Create gallery item (Admin)
// // @route   POST /api/gallery
// const createGalleryItem = async (req, res) => {
//   try {
//     const { title, image_url, category, type, description } = req.body;

//     const item = await Gallery.create({
//       title,
//       image_url,
//       category,
//       type: type || "image",
//       description,
//     });

//     res.status(201).json({
//       success: true,
//       data: item,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Delete gallery item (Admin)
// // @route   DELETE /api/gallery/:id
// const deleteGalleryItem = async (req, res) => {
//   try {
//     const item = await Gallery.delete(req.params.id);
//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery item not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Gallery item deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // @desc    Update gallery item (Admin)
// // @route   PUT /api/gallery/:id
// const updateGalleryItem = async (req, res) => {
//   try {
//     const item = await Gallery.update(req.params.id, req.body);
//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery item not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: item,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getGallery,
//   createGalleryItem,
//   deleteGalleryItem,
//   updateGalleryItem,
// };
