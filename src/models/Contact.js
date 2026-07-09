const { pool } = require("../config/db");

const Contact = {
  create: async (contactData) => {
    const { fullName, email, subject, message } = contactData;
    const query = `
            INSERT INTO contacts (full_name, email, subject, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id, full_name, email, subject, message, status, created_at
        `;
    const values = [fullName, email, subject, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const query = "SELECT * FROM contacts ORDER BY created_at DESC";
    const result = await pool.query(query);
    return result.rows;
  },

  findById: async (id) => {
    const query = "SELECT * FROM contacts WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  updateStatus: async (id, status) => {
    const query = `
            UPDATE contacts 
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  },

  delete: async (id) => {
    const query = "DELETE FROM contacts WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = Contact;
