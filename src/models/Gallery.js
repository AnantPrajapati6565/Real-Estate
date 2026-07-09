const { pool, queryWithRetry } = require("../config/db");

const Gallery = {
  // Get all gallery items
  findAll: async () => {
    const query = "SELECT * FROM gallery ORDER BY created_at DESC";
    const result = await queryWithRetry(query);
    return result.rows;
  },

  // Get gallery by category
  findByCategory: async (category) => {
    const query =
      "SELECT * FROM gallery WHERE category = $1 ORDER BY created_at DESC";
    const result = await queryWithRetry(query, [category]);
    return result.rows;
  },

  // Get gallery by ID
  findById: async (id) => {
    const query = "SELECT * FROM gallery WHERE id = $1";
    const result = await queryWithRetry(query, [id]);
    return result.rows[0];
  },

  // Create gallery item
  create: async (data) => {
    const { title, image_url, category, type, description } = data;
    const query = `
            INSERT INTO gallery (title, image_url, category, type, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
    const values = [title, image_url, category, type, description];
    const result = await queryWithRetry(query, values);
    return result.rows[0];
  },

  // Delete gallery item
  delete: async (id) => {
    const query = "DELETE FROM gallery WHERE id = $1 RETURNING id";
    const result = await queryWithRetry(query, [id]);
    return result.rows[0];
  },

  // Update gallery item
  update: async (id, data) => {
    const fields = [];
    const values = [];
    let counter = 1;

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        fields.push(`${dbKey} = $${counter}`);
        values.push(data[key]);
        counter++;
      }
    });

    values.push(id);
    const query = `
            UPDATE gallery 
            SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${counter}
            RETURNING *
        `;

    const result = await queryWithRetry(query, values);
    return result.rows[0];
  },
};

module.exports = Gallery;
