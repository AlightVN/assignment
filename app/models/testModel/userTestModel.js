const { DataTypes } = require('sequelize');
const sequelize = require('../../database/configDB');
const EmployeeTest = require('./employeeTestModel');
const bcrypt = require('bcrypt');

const TestUser = sequelize.define('TestUser', {
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
      model: EmployeeTest,
      key: 'employeeNumber',
    },
    unique: true,
  },
});
TestUser.register = async function (userName, password) {
  const encryptedPassword = bcrypt.hashSync(password, 10);
  const user = await TestUser.create({ userName, password: encryptedPassword });
  return user;
};

// Tạo phương thức tùy chỉnh login
TestUser.login = async function (userName, password) {
  const user = await TestUser.findOne({ where: { userName } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// Setup references
EmployeeTest.hasOne(TestUser, { foreignKey: 'employeeNumber' });
TestUser.belongsTo(EmployeeTest, { foreignKey: 'employeeNumber', as: 'employeeAccount' });

module.exports = TestUser;
