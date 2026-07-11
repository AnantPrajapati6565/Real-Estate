const { pool, queryWithRetry } = require("../config/db");

const Dashboard = {
  // Get all counts in one query
  getCounts: async () => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM projects) as projects,
        (SELECT COUNT(*) FROM contacts) as contacts,
        (SELECT COUNT(*) FROM testimonials) as testimonials,
        (SELECT COUNT(*) FROM services) as services,
        (SELECT COUNT(*) FROM gallery) as gallery
    `;
    const result = await queryWithRetry(query);
    return result.rows[0];
  },

  // Get recent contacts (default 5)
  getRecentContacts: async (limit = 5) => {
    const query = `
      SELECT id, full_name, subject, status, created_at
      FROM contacts
      ORDER BY created_at DESC
      LIMIT $1
    `;
    const result = await queryWithRetry(query, [limit]);
    return result.rows;
  },

  // Get recent projects (default 5)
  getRecentProjects: async (limit = 5) => {
    const query = `
      SELECT id, name, location, status, created_at
      FROM projects
      ORDER BY created_at DESC
      LIMIT $1
    `;
    const result = await queryWithRetry(query, [limit]);
    return result.rows;
  },
};

module.exports = Dashboard;
