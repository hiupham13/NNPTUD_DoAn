const jwt = require('jsonwebtoken');

/**
 * Sign JWT token
 * @param {{ userId: string, role: string }} payload
 * @returns {string} JWT token
 */
const generateToken = ({ userId, role }) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

module.exports = generateToken;
