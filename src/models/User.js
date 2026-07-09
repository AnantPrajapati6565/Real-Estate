const { pool, queryWithRetry } = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
  create: async (userData) => {
    const { name, email, password, role = "user" } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, hashedPassword, role];
    const result = await queryWithRetry(query, values);
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await queryWithRetry(query, [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const query =
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1";
    const result = await queryWithRetry(query, [id]);
    return result.rows[0];
  },

  findAll: async () => {
    const query =
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC";
    const result = await queryWithRetry(query);
    return result.rows;
  },

  update: async (id, userData) => {
    const fields = [];
    const values = [];
    let counter = 1;

    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined && key !== "password" && key !== "id") {
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        fields.push(`${dbKey} = $${counter}`);
        values.push(userData[key]);
        counter++;
      }
    });

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      fields.push(`password = $${counter}`);
      values.push(hashedPassword);
      counter++;
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${counter}
      RETURNING id, name, email, role, created_at, updated_at
    `;

    const result = await queryWithRetry(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    const query = "DELETE FROM users WHERE id = $1 RETURNING id";
    const result = await queryWithRetry(query, [id]);
    return result.rows[0];
  },

  comparePassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  exists: async (email) => {
    const query = "SELECT id FROM users WHERE email = $1";
    const result = await queryWithRetry(query, [email]);
    return result.rows.length > 0;
  },

  count: async () => {
    const query = "SELECT COUNT(*) as total FROM users";
    const result = await queryWithRetry(query);
    return parseInt(result.rows[0].total);
  },

  findByRole: async (role) => {
    const query =
      "SELECT id, name, email, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC";
    const result = await queryWithRetry(query, [role]);
    return result.rows;
  },

  updateLastLogin: async (id) => {
    const query = `
      UPDATE users 
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, updated_at
    `;
    const result = await queryWithRetry(query, [id]);
    return result.rows[0];
  },
};

module.exports = User;
