const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // user object should contain email, uid, and optionally displayName, photoURL
  const payload = {
    email: user.email,
    uid: user.uid, // Assuming uid is passed in the user object
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Token expiration time
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // It's often better to let the caller handle the error or log it,
    // returning null can mask issues. Consider throwing the error.
    // For now, keeping it as null to match previous discussions if any.
    console.error('JWT Verification Error:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};