const winston = require('winston');
const LogModel = require('../models/loggerModel');
const path = require('path');

// Custom format function to create data in Mongoose
const mongooseCreateFormat = winston.format((info) => {
  // Only save to MongoDB if the environment is production
  if (process.env.NODE_ENV === 'production') {
    const { level, message, timestamp, userName } = info;
    // Create the log entry in Mongoose
    const logEntry = new LogModel({
      level,
      message,
      userName,
      timestamp,
    });
    // Save the log entry
    logEntry.save()
        .catch((error) => {
        // Handle any error that occurred while saving
          console.error('Failed to save log entry:', error);
        });
  }

  return info;
});

// Custom format for console output
const customConsoleFormat = winston.format.printf(({ level, message, timestamp, userName }) => {
  return `${timestamp} [${level}] ${userName ? userName : 'undefined'}: ${message}`;
});

// Create the logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      mongooseCreateFormat(), // Add the custom format function
  ),
  transports: [
    new winston.transports.File({ filename: path.join('app', 'logger', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('app', 'logger', 'combined.log') }),
    new winston.transports.File({ filename: path.join('app', 'logger', 'info.log'), level: 'info' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        customConsoleFormat,
    ),
  }));
}

module.exports = logger;
