const { generateToken } = require('../utils/jwt');

const issueJwtToken = async (req, res) => {
  try {
    // Client now sends email, uid, displayName, photoURL
    const { email, uid, displayName, photoURL } = req.body;
    if (!email) {
      return res.status(400).send({ message: 'User email is required to generate token.' });
    }

    // Pass the necessary fields to generateToken
    const token = generateToken({ email, uid, displayName, photoURL });

    res.send({ token });
  } catch (error) {
    console.error('Error issuing JWT token:', error);
    res.status(500).send({ message: 'Failed to issue JWT token', error: error.message });
  }
};

module.exports = {
  issueJwtToken,
};