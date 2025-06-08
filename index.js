const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDB } = require("./src/config/db"); // Import connectDB
const authRoutes = require("./src/routes/authRoutes"); // Import auth routes
const packageRoutes = require("./src/routes/packageRoutes"); // Import package routes
const bookingRoutes = require("./src/routes/bookingRoutes"); // Import booking routes

const app = express();
const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(); // Connect to MongoDB

    // A more attractive root route
    app.get("/", (req, res) => {
      res.send(`
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✈️</text></svg>">
            <title>TourZen Server API</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #2c3e50; color: #ecf0f1; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; }
              .container { background-color: #34495e; padding: 40px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
              h1 { color: #3b82f6; /* Light Blue */ margin-bottom: 20px; font-size: 3.5em; }
              p { font-size: 1.5em; color: #FF5C00; margin-bottom: 20px; }
              .status-indicator { width: 25px; height: 25px; background-color: #2ecc71; border-radius: 50%; display: inline-block; vertical-align: middle; box-shadow: 0 0 20px #2ecc71, 0 0 20px #2ecc71; animation: pulse 1s infinite ease-in-out; }
              @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
              .status-label { font-size: 1.5em; font-weight: bold; color: #ffffff; /* White */ vertical-align: middle; margin-right: 5px;}
              .status-value { font-size: 1.5em; font-weight: bold; color: #3b82f6; /* Tailwind's blue-500 */ vertical-align: middle; margin-right: 10px;}
              .status-line { margin-bottom: 20px; /* Same as h1's margin-bottom */ }
              .api-version {color: #00c04b;}
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to the TourZen Server API!</h1>
              <p>This server powers the TourZen platform, managing tours, bookings, and user data.</p>
              <div class="status-line">
                <span class="status-label">Server Status:</span>
                <span class="status-value">Online & Connected to MongoDB Database</span>
                <span class="status-indicator"></span>
              </div>
              <p class="api-version">API Version: 1.0</p>
            </div>
          </body>
        </html>
      `);
    });

    // Middleware
    app.use(cors()); // Enable CORS for all routes
    app.use(express.json()); // To parse JSON request bodies

    // API Routes
    app.use("/api/v1/auth", authRoutes); // Mount auth routes
    app.use("/api/v1/bookings", bookingRoutes); // Mount booking routes
    app.use("/api/v1/packages", packageRoutes); // Mount package routes

    // Basic route for testing
    app.get("/api/v1", (req, res) => {
      res.send("TourZen Server is running!");
    });

    app.listen(port, () => {
      console.log(`TourZen Server Running on Port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();
