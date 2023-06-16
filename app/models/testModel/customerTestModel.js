const { DataTypes } = require('sequelize');
const sequelize = require('../../database/configDB');
const EmployeeTest = require('./employeeTestModel');

const CustomerTest = sequelize.define(
  'CustomerTest',
  {
    customerNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactFirstName: {
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
        model: EmployeeTest,
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

// CRUD methods
CustomerTest.getAll = function() {
  return this.findAll();
};

CustomerTest.getById = function(id) {
  return this.findByPk(id);
};

CustomerTest.createCustomer = function(customer) {
  return this.create(customer);
};

CustomerTest.updateById = function(id, updates) {
  return this.update(updates, { where: { customerNumber: id } });
};

CustomerTest.deleteById = function(id) {
  return this.destroy({ where: { customerNumber: id } });
};

// Setup references
CustomerTest.belongsTo(EmployeeTest, { foreignKey: 'salesRepEmployeeNumber', as: 'salesRep' });

module.exports = CustomerTest;
