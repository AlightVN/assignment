const permissions = require('../utils/permissions');
const logger = require('../database/winstonConfig');

const authorize = (resource, action) => {
  return (req, res, next) => {
    const { role } = req.userData;

    // Check Role
    if (permissions[resource] &&
       permissions[resource][action] &&
       permissions[resource][action].includes(role)) {
      // Access Perm
      next();
    } else {
      logger.error('Unauthorized access attempt');
      // Deny
      return res.status(403).json({ message: 'You are not authorized to access this resource.' });
    }
  };
};

module.exports = authorize;
