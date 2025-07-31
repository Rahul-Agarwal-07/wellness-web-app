const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded token data in req.user
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
