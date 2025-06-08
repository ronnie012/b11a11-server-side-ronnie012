const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./src/config/db'); // Import connectDB
const authRoutes = require('./src/routes/authRoutes'); // Import auth routes
const packageRoutes = require('./src/routes/packageRoutes'); // Import package routes
const bookingRoutes = require('./src/routes/bookingRoutes'); // Import booking routes

const app = express();
const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(); // Connect to MongoDB

    app.get('/', (req, res) => {
      res.send('Welcome to TourZen Server!')
    })
    
    // Middleware
    app.use(cors()); // Enable CORS for all routes
    app.use(express.json()); // To parse JSON request bodies
    
    // API Routes
    app.use('/api/v1/auth', authRoutes); // Mount auth routes
    app.use('/api/v1/bookings', bookingRoutes); // Mount booking routes
    app.use('/api/v1/packages', packageRoutes); // Mount package routes
    
    // Basic route for testing
    app.get('/api/v1', (req, res) => {
      res.send('TourZen Server is running!');
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
