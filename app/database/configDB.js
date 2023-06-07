// Import Sequelize and dotenv libraries
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Import mysql2 library for better performance with MySQL
const mysql2 = require('mysql2');

// Create a Sequelize instance using the environment variables from .env file
const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: mysql2,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // Disable SQL query logging
});

// Synchronize the Sequelize models with the MySQL database
sequelize
    .sync({ alter: true }) // Update the schema to match the model definitions
    .then(() => {
      console.log('MYSQL Database synchronized'); // Log success message on successful synchronization
    })
    .catch((error) => {
      console.error('Error synchronizing database:', error); // Log error message on failed synchronization
    });

// Export the Sequelize instance for use in other modules
module.exports = sequelize;
