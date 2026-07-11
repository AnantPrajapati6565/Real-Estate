const Dashboard = require("../models/Dashboard");

// @desc    Get dashboard stats (counts + recent items)
// @route   GET /api/dashboard/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Fetch all data in parallel for speed
    const [counts, recentContacts, recentProjects] = await Promise.all([
      Dashboard.getCounts(),
      Dashboard.getRecentContacts(5),
      Dashboard.getRecentProjects(5),
    ]);

    res.json({
      success: true,
      data: {
        counts,
        recentContacts,
        recentProjects,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboardStats };
