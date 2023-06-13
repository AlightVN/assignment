// Import required libraries
const chai = require('chai');
const chaiHttp = require('chai-http');
const { User } = require('../app/models');
const app = require('../index');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);

// eslint-disable-next-line no-unused-vars
let token;

// Function to login a user and return the login response
async function loginUser() {
  const res = await chai.request(app)
    .post('/user/login')
    .send({ userName: 'testuser', password: 'Test@123' });

  token = res.body.token;
  return res;
}

// User test suite
describe('POST /users', () => {
  before(async () => {
    // Delete all existing users before each test
    await User.destroy({ where: {} });
  });

  // Test POST (create user)
  it('Create new user successfully', (done) => {
    const newUser = {
      userName: 'testuser',
      password: 'Test@123',
      employeeNumber: 1,
    };

    chai.request(app)
      .post('/user/register')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.user.should.have.property('userName').eql(newUser.userName);
        res.body.user.should.have.property('employeeNumber').eql(newUser.employeeNumber);
        res.body.should.have.property('token');
        done();
      });
  });

  // Test POST (create user with invalid data)
  it('Create new user fails with invalid data', (done) => {
    const invalidUser = {
      userName: 'te',
      password: 'Test123',
      employeeNumber: 2,
    };

    chai.request(app)
      .post('/user/register')
      .send(invalidUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
  });

  // Test login with valid user credentials
  it('Login user with valid credentials', (done) => {
    loginUser().then((res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      done();
    });
  });

});

// Export loginUser function
module.exports = {
  loginUser,
};
