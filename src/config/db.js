const { Pool } = require("pg");

// Create connection pool with better options
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Handle pool errors gracefully
pool.on("error", (err) => {
  console.error("❌ Unexpected pool error:", err.message);
});

// Helper function to execute queries with retry
const queryWithRetry = async (text, params, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      if (
        error.message.includes("Connection terminated") ||
        error.message.includes("Connection error") ||
        error.message.includes("timeout")
      ) {
        console.log(`🔄 Query retry ${i + 1}/${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Query failed after multiple retries");
};

// Test connection with retry logic
const connectDB = async (retries = 5, delay = 3000) => {
  try {
    const client = await pool.connect();
    console.log("✅ Neon PostgreSQL Connected Successfully");
    client.release();
    await createTables();
    return true;
  } catch (error) {
    console.error(`❌ Database Connection Error:`, error.message);

    if (retries > 0) {
      console.log(
        `⏳ Retrying in ${delay / 1000} seconds... (${retries} attempts left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectDB(retries - 1, delay + 1000);
    } else {
      console.error("❌ All connection attempts failed");
      setTimeout(() => connectDB(3, 5000), 30000);
      return false;
    }
  }
};

// Create all tables
const createTables = async () => {
  try {
    const client = await pool.connect();

    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contacts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        image VARCHAR(500) NOT NULL,
        status VARCHAR(50) DEFAULT 'available',
        category VARCHAR(50) NOT NULL,
        features TEXT[],
        bedrooms INTEGER,
        bathrooms INTEGER,
        area VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100) NOT NULL,
        features TEXT[],
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Testimonials Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        project VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        image VARCHAR(500),
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Gallery Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        category VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'image',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ All tables created/verified successfully");
    client.release();
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
  }
};

module.exports = { pool, connectDB, queryWithRetry };
