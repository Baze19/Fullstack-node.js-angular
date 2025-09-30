const jwt = require('jsonwebtoken');

// Mock users database (in production, use a real database)
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$3uDYqJaKn.xyZXiPiiIs6.NTmwLDcnj55XKLnHcJ7ZAbyBJ.lpYqW', // admin123
    role: 'admin',
    email: 'admin@example.com'
  },
  {
    id: 2,
    username: 'user',
    password: '$2a$10$TVA0P.iaax16TqV.wrLseePEilKeXsHPGPcGnh.y8w0WXogZTR4Tu', // user123
    role: 'user',
    email: 'user@example.com'
  }
];

// Mock search history storage (in production, use a real database)
let searchHistory = [];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  users,
  searchHistory,
  authenticateToken,
  requireRole
};


