const { verifyToken } = require('../utils/jwt');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized: No token provided or malformed token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      // verifyToken in your utils/jwt.js currently returns null on error and logs.
      // If it threw an error, this catch block would handle it.
      // Given it returns null, we explicitly check for it.
      return res.status(403).send({ message: 'Forbidden: Invalid token.' });
    }
    req.user = decoded; // Add decoded payload to request object
    next();
  } catch (error) {
    // This catch block is more relevant if verifyToken itself throws.
    // For now, the null check above handles the current verifyToken behavior.
    console.error('JWT Verification Error in Middleware:', error);
    return res.status(403).send({ message: 'Forbidden: Invalid token.' });
  }
};

module.exports = verifyJWT;