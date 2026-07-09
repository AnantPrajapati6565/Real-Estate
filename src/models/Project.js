const { pool } = require("../config/db");

const Project = {
  findAll: async (filters = {}) => {
    let query = "SELECT * FROM projects";
    const values = [];
    const conditions = [];

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }
    if (filters.category) {
      values.push(filters.category);
      conditions.push(`category = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  },

  findById: async (id) => {
    const query = "SELECT * FROM projects WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  create: async (projectData) => {
    const {
      name,
      description,
      price,
      location,
      image,
      status,
      category,
      features,
      bedrooms,
      bathrooms,
      area,
    } = projectData;

    const query = `
            INSERT INTO projects (
                name, description, price, location, image,
                status, category, features, bedrooms,
                bathrooms, area
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
    const values = [
      name,
      description,
      price,
      location,
      image,
      status || "available",
      category,
      features || [],
      bedrooms,
      bathrooms,
      area,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  update: async (id, projectData) => {
    const fields = [];
    const values = [];
    let counter = 1;

    Object.keys(projectData).forEach((key) => {
      if (projectData[key] !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        fields.push(`${dbKey} = $${counter}`);
        values.push(projectData[key]);
        counter++;
      }
    });

    values.push(id);
    const query = `
            UPDATE projects 
            SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${counter}
            RETURNING *
        `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    const query = "DELETE FROM projects WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = Project;
