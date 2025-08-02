const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  console.log("JWT Middleware","Initiated");

  const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    console.log("JWT Middleware","Initiated");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded token data in req.user
    next();
  } catch (err) {
    console.log("JWT Middleware",err.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};
