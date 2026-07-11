const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const testimonialRoutes = require("./src/routes/testimonialRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");

const dashboardRoutes = require("./src/routes/dashboardRoutes");

// Import database connection
const { connectDB, pool } = require("./src/config/db");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Graceful shutdown handlers
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

// Connect to database with retry
let dbConnected = false;
const initDB = async () => {
  try {
    dbConnected = await connectDB();
    if (dbConnected) {
      console.log("✅ Database connection established successfully");
    }
  } catch (error) {
    console.error("❌ Initial database connection failed:", error.message);
    // Will retry in the background
  }
};

// Start database connection
initDB();

app.use("/api/dashboard", dashboardRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🏡 Real Estate API is running",
    version: "1.0.0",
    database: "Neon PostgreSQL",
    status: dbConnected ? "connected" : "connecting...",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: Neon PostgreSQL`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("🔄 Shutting down gracefully...");
  server.close(async () => {
    console.log("✅ HTTP server closed");
    try {
      await pool.end();
      console.log("✅ Database pool closed");
      process.exit(0);
    } catch (err) {
      console.error("❌ Error closing database pool:", err);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Reconnect if database connection is lost
setInterval(async () => {
  if (!dbConnected) {
    console.log("🔄 Attempting to reconnect to database...");
    try {
      dbConnected = await connectDB();
      if (dbConnected) {
        console.log("✅ Database reconnected successfully");
      }
    } catch (error) {
      console.error("❌ Reconnection failed:", error.message);
    }
  }
}, 60000); // Check every minute
