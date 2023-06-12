const chai = require('chai');
const chaiHttp = require('chai-http');
const { Employee, User } = require('../app/models');
const app = require('../index');
const {
  insertSamplePermissions,
  insertOffices,
  insertSampleEmployees,
  insertCustomers
} = require('../app/demo/demo');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);

describe('API tests', function () {
  let token;

  beforeEach(async () => {
    await insertSamplePermissions();
    await insertOffices();
    await insertSampleEmployees();
    await insertCustomers();
    console.log('Demo data inserted.');

    const testEmployee = await Employee.findByPk(1);
    if (!testEmployee) {
      throw new Error('Employee with employeeNumber 1 not found.');
    }

    await createTestUser(testEmployee.employeeNumber);
    token = await loginAndGetToken();
  });

  afterEach(async () => {
    // Clean up test data
    await User.destroy({ where: { userName: 'testuser' } });
  });

  // Add your tests here
  describe('GET /employees', () => {
    it('should GET all employees', (done) => {
      chai.request(app)
        .get('/employees')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.at.least(1);
          done();
        });
    });
  });
});

const createTestUser = async (employeeNumber) => {
  // Create a test user
  await User.create({
    userName: 'testuser',
    password: 'Test@1234', // Use a hashed password in production
    employeeNumber: employeeNumber,
  });
};

// get token
const loginAndGetToken = async () => {
  const res = await chai.request(app)
    .post('/login')
    .send({
      username: 'testuser',
      password: 'Test@1234',
    });

  return res.body.token;
};
