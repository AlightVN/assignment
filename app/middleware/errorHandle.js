const logger = require('../database/winstonConfig');
const errorHandler = (err, req, res, _next) => {
  logger.error({ message: `Error: ${err.message}`, userName: req.userData.userName?req.userData.userName:'unknow' });
  const statusCode = err.statusCode || 500;
  const statusMessage = statusCode === 500 ? 'Internal Server Error' : 'Error';
  res.status(statusCode).json({
    status: statusMessage,
    message: err.message,
  });
};

module.exports = errorHandler;
