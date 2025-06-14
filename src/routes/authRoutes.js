const express = require('express');
const { verifyFirebaseTokenAndIssueJwt } = require('../controllers/authController'); // Updated import
const verifyJWT = require('../middleware/verifyJWT'); // Import the middleware

const router = express.Router();

// Endpoint for client to get custom JWT after Firebase authentication (Firebase ID token verification)
router.post('/firebase-login', verifyFirebaseTokenAndIssueJwt); // Use the updated controller function

// A simple protected route for testing JWT verification
router.get('/test-protected', verifyJWT, (req, res) => {
  // If verifyJWT passes, req.user will contain the decoded token payload
  res.send({ message: `Hello ${req.user.email}! This is a protected route.` });
});

module.exports = router;


