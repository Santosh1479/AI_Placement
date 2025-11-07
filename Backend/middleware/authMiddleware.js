const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// JWT authentication middleware
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Student.findById(decoded._id);
      if (!req.user) throw new Error();
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role || 'Student')) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};

module.exports = { protect, authorize };