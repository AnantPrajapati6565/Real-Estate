const { pool } = require("../config/db");

const Testimonial = {
  findApproved: async () => {
    const query = `
            SELECT * FROM testimonials 
            WHERE is_approved = true 
            ORDER BY created_at DESC
        `;
    const result = await pool.query(query);
    return result.rows;
  },

  findAll: async () => {
    const query = "SELECT * FROM testimonials ORDER BY created_at DESC";
    const result = await pool.query(query);
    return result.rows;
  },

  create: async (testimonialData) => {
    const {
      name,
      location,
      project,
      content,
      rating = 5,
      image,
      isApproved = false,
    } = testimonialData;
    const query = `
            INSERT INTO testimonials (name, location, project, content, rating, image, is_approved)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
    const values = [
      name,
      location,
      project,
      content,
      rating,
      image,
      isApproved,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  approve: async (id) => {
    const query = `
            UPDATE testimonials 
            SET is_approved = true, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  delete: async (id) => {
    const query = "DELETE FROM testimonials WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = Testimonial;
