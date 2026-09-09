const jwt = require('jsonwebtoken');
const User = require('../models/User');

// التحقق من صلاحية التوكن وقراءة المستخدم
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware مرن للتحقق من الأدوار والمستويات الصلاحية
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userRole = req.user.role;

    // توحيد المعاملة بين patient و user
    const hasRole = roles.some((role) => {
      if (role === 'patient' || role === 'user') {
        return userRole === 'patient' || userRole === 'user';
      }
      return role === userRole;
    });

    if (!hasRole) {
      return res.status(403).json({ 
        message: `User role '${userRole}' is not authorized to access this route` 
      });
    }

    next();
  };
};