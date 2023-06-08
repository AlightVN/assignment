const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../database/winstonConfig');
require('dotenv').config();

// Login
exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { userName } });

    // Check if user not found or password is incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.error({ message: `Error: user or password Incorrect`, userName: 'notLogin' });
      return res.status(401).json({ message: 'Incorrect username or password. You trying to cheat?' });
    }
    // Create JWT token
    const token = jwt.sign({ userName }, process.env.JWT_SECRET);
    // Return token to user
    logger.info({ message: 'Login Account successfully', userName: user.userName });
    res.json({
      status: 'Success',
      message: 'Login Account successfully',
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

// Register
exports.register = async (req, res) => {
  try {
    const { userName, password, employeeNumber } = req.body;
    // Check if username is already in use
    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) {
      logger.error({ message: `Username is already in use`, userName: 'registerNew' });
      return res.status(400).json({ message: 'Username is already in use. Please choose another one.' });
    }
    // Generate secure password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = await User.create({ userName, password: hashedPassword, employeeNumber });
    // Check if newUser was created successfully
    if (!newUser) {
      logger.error({ message: `An error occurred. Please try again later`, userName: 'registerNew' });
      return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
    // Create JWT token
    const token = jwt.sign({ userName }, process.env.JWT_SECRET);
    // Return user information and token to user
    return res.status(200).json({
      user: {
        userName: newUser.userName,
        employeeNumber: newUser.employeeNumber,
      },
      token,
    });
  } catch (error) {
    logger.error({ message: `An error occurred. Please try again later`, userName: 'registerNew' });
    console.error(error);
    return res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};
