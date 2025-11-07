const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const HOD = require('../models/HODmodel');
const PlacementOfficer = require('../models/PlaceOfficer');

// Student JWT authentication middleware
const authStudent = async (req, res, next) => {
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
      return res.status(401).json({ message: 'Student not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Student not authorized, no token' });
  }
};

// HOD JWT authentication middleware
const authHOD = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await HOD.findById(decoded._id);
      if (!req.user) throw new Error();
      next();
    } catch (error) {
      return res.status(401).json({ message: 'HOD not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'HOD not authorized, no token' });
  }
};

// Placement Officer JWT authentication middleware
const authPlaceOfficer = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await PlacementOfficer.findById(decoded._id);
      if (!req.user) throw new Error();
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Placement Officer not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Placement Officer not authorized, no token' });
  }
};

module.exports = { authStudent, authHOD, authPlaceOfficer };