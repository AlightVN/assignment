const { DataTypes } = require('sequelize');
const sequelize = require('../database/configDB');

const Office = sequelize.define(
    'Office',
    {
      officeCode: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      city: {
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
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      territory: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'offices',
    },
);

module.exports = Office;
