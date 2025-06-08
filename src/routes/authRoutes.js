const express = require('express');
const { issueJwtToken } = require('../controllers/authController');
const verifyJWT = require('../middleware/verifyJWT'); // Import the middleware

const router = express.Router();

// Endpoint for client to get JWT after Firebase authentication
router.post('/jwt', issueJwtToken);

// A simple protected route for testing JWT verification
router.get('/test-protected', verifyJWT, (req, res) => {
  // If verifyJWT passes, req.user will contain the decoded token payload
  res.send({ message: `Hello ${req.user.email}! This is a protected route.` });
});

module.exports = router;