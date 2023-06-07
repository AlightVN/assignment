const { DataTypes } = require('sequelize');
const sequelize = require('../database/configDB');
const Permission = require('./permissionModel'); // Import Permission model
const Office = require('./officeModel'); // Import Permission model


const Employee = sequelize.define(
    'Employee',
    {
      employeeNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      extension: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      officeCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Office,
          key: 'officeCode',
        },
      },
      reportsTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'reportsTo',
        references: {
          model: 'employees',
          key: 'employeeNumber',
        },
      },
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Permission,
          key: 'id',
        },
      },
    },
    {
      tableName: 'employees',
    },
);

// Setup references
Employee.belongsTo(Employee, { foreignKey: 'reportsTo', as: 'supervisor' });
Employee.belongsTo(Permission, { foreignKey: 'roleId', as: 'role' });
Employee.belongsTo(Office, { foreignKey: 'officeCode', as: 'company' });
module.exports = Employee;
