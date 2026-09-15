const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route (Token missing)'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'ccmers_super_secret_jwt_key_2026'
    );

    // Try to find in DB if DB is active, otherwise rely on token payload
    let user;
    try {
      user = await User.findById(decoded.id).select('-password');
    } catch {
      // Fallback to token payload
    }

    req.user = user || {
      _id: decoded.id,
      id: decoded.userId || decoded.id,
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      department: decoded.department
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route (Invalid token)'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
