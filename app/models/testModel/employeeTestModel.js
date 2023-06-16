const { DataTypes } = require('sequelize');
const sequelize = require('../../database/configDB');
const Permission = require('../permissionModel'); // Import Permission model
const Office = require('../officeModel'); // Import Permission model


const EmployeeTest = sequelize.define(
    'EmployeeTest',
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
// CRUD methods
EmployeeTest.getAll = function() {
  return this.findAll();
};

EmployeeTest.getById = function(id) {
  return this.findByPk(id);
};

EmployeeTest.createEmployee = function(employee) {
  return this.create(employee);
};

EmployeeTest.updateById = function(id, updates) {
  return this.update(updates, { where: { employeeNumber: id } });
};

EmployeeTest.deleteById = function(id) {
  return this.destroy({ where: { employeeNumber: id } });
};

// Setup references
EmployeeTest.belongsTo(EmployeeTest, { foreignKey: 'reportsTo', as: 'supervisor' });
EmployeeTest.belongsTo(Permission, { foreignKey: 'roleId', as: 'role' });
EmployeeTest.belongsTo(Office, { foreignKey: 'officeCode', as: 'company' });
module.exports = EmployeeTest;
