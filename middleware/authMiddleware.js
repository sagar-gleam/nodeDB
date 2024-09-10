// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || '05003'; // Replace with your actual secret key

const authenticateToken = (req, res, next) => {
  // console.log(req.headers);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  
  if (token == null) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res.sendStatus(403); // Invalid token
    }
    req.user = user;
    next();
  });
  
};

module.exports = { authenticateToken };
