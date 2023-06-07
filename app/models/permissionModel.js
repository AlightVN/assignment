const { DataTypes } = require('sequelize');
const sequelize = require('../database/configDB');

const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'permissions',
    },
);

module.exports = Permission;
