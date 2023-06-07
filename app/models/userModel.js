const { DataTypes } = require('sequelize');
const sequelize = require('../database/configDB');
const Employee = require('./employeeModel');

const User = sequelize.define(
    'User',
    {
      userName: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employeeNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Employee,
          key: 'employeeNumber',
        },
        unique: true,
      },
    },
);
// Setup references
// Setup references
Employee.hasOne(User, { foreignKey: 'employeeNumber' });
User.belongsTo(Employee, { foreignKey: 'employeeNumber', as: 'employeeAccount' });


module.exports = User;
