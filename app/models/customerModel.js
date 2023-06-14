const { DataTypes } = require('sequelize');
const sequelize = require('../database/configDB');
const Employee = require('./employeeModel');

const Customer = sequelize.define(
    'Customer',
    {
      customerNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      contractLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contractFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salesRepEmployeeNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Employee,
          key: 'employeeNumber',
        },
      },
      creditLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'customers',
    },
);

// Setup references
Customer.belongsTo(Employee, {
  foreignKey: 'salesRepEmployeeNumber',
});

module.exports = Customer;
