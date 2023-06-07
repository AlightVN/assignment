const logger = require('../database/winstonConfig');
const errorHandler = (err, req, res, next) => {
  logger.error({ message: `Error: ${err.message}`, userName: req.userData.userName });
  res.status(500).json({
    status: 'Internal Server Error',
    message: err.message,
  });
};

module.exports = errorHandler;
