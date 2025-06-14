const { generateToken } = require('../utils/jwt');
const { admin } = require('../config/firebaseAdmin'); // Import the initialized Firebase Admin instance

// Renamed to reflect its new purpose: verify Firebase ID token and then issue our custom JWT
const verifyFirebaseTokenAndIssueJwt = async (req, res) => {
  try {
    const { idToken } = req.body; // Expecting Firebase ID token from client

    if (!idToken) {
      return res.status(400).send({ message: 'Firebase ID token is required.' });
    }

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Token is verified, extract user info
    const { uid, email, name, picture } = decodedToken;

    // Prepare user object for our custom JWT
    const userForOurJwt = {
      uid,
      email,
      displayName: name, // Firebase 'name' maps to 'displayName'
      photoURL: picture, // Firebase 'picture' maps to 'photoURL'
    };

    const token = generateToken(userForOurJwt);

    res.send({ token });
  } catch (error) {
    console.error('Error verifying Firebase ID token or issuing JWT:', error);
    res.status(401).send({ message: 'Authentication failed. Invalid or expired token.', error: error.message });
  }
};

module.exports = {
  verifyFirebaseTokenAndIssueJwt, // Export the renamed function
};