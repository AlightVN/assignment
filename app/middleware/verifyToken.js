const jwt = require('jsonwebtoken');
const { User, Employee, Permission } = require('../models');
const logger = require('../database/winstonConfig');
const checkTokenMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.error('Token not found');
    return res.status(401).json({ message: 'Token not found.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userName } = decoded;
    const user = await User.findOne({
      where: { userName },
      include: [
        { model: Employee, as: 'employeeAccount', include: [{ model: Permission, as: 'role' }] },
      ],
    });

    if (!user || !user.employeeAccount) {
      throw new Error('User or corresponding employee information not found.');
    }

    req.userData = {
      userName: user.userName,
      role: user.employeeAccount.role.roleName.toLowerCase(),
      officeCode: user.employeeAccount.officeCode,
      employeeNumber: user.employeeAccount.employeeNumber,
    };

    next();
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = checkTokenMiddleware;
