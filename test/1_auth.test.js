// test/auth.test.js
const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { login, register } = require('../app/controllers/userController');
const User = require('../app/models/userModel');
const { expect } = chai;

describe('Auth Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Login', () => {
    it('should return a token if the credentials are valid', async () => {
      const req = {
        body: {
          userName: 'testUser',
          password: 'testPassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      const user = {
        userName: 'testUser',
        password: await bcrypt.hash('testPassword', 10),
      };

      sinon.stub(User, 'findOne').resolves(user);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('testToken');

      await login(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Login Account successfully',
        token: 'testToken',
      })).to.be.true;
    });

    it('should return 401 if user is not found', async () => {
      const req = {
        body: {
          userName: 'nonExistingUser',
          password: 'testPassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      sinon.stub(User, 'findOne').resolves(null);

      await login(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        message: 'Incorrect username or password. You trying to cheat?',
      })).to.be.true;
    });

    it('should return 401 if the password is incorrect', async () => {
      const req = {
        body: {
          userName: 'testUser',
          password: 'incorrectPassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      const user = {
        userName: 'testUser',
        password: await bcrypt.hash('testPassword', 10),
      };

      sinon.stub(User, 'findOne').resolves(user);
      sinon.stub(bcrypt, 'compare').resolves(false);

      await login(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        message: 'Incorrect username or password. You trying to cheat?',
      })).to.be.true;
    });

    it('should call next with an error if an error occurs during login', async () => {
      const req = {
        body: {
          userName: 'testUser',
          password: 'testPassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      const expectedError = new Error('Login error');

      sinon.stub(User, 'findOne').throws(expectedError);

      await login(req, res, next);

      sinon.assert.calledWith(next, expectedError);
    });
  });

  describe('Register', () => {
    it('should register a new user and return user information and token', async () => {
      const req = {
        body: {
          userName: 'testUser',
          password: 'testPassword',
          employeeNumber: 1234,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const newUser = {
        userName: 'testUser',
        password: await bcrypt.hash('testPassword', 10),
        employeeNumber: 1234,
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'genSalt').resolves(10);
      sinon.stub(bcrypt, 'hash').resolves(newUser.password);
      sinon.stub(User, 'create').resolves(newUser);
      sinon.stub(jwt, 'sign').returns('testToken');

      await register(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        user: {
          userName: newUser.userName,
          employeeNumber: newUser.employeeNumber,
        },
        token: 'testToken',
      })).to.be.true;
    });

    it('should return 400 if the username is already in use', async () => {
      const req = {
        body: {
          userName: 'existingUser',
          password: 'testPassword',
          employeeNumber: 1234,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const existingUser = {
        userName: 'existingUser',
      };

      sinon.stub(User, 'findOne').resolves(existingUser);

      await register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        message: 'Username is already in use. Please choose another one.',
      })).to.be.true;
    });

    it('should return 500 if an error occurs while creating a new user', async () => {
      const req = {
        body: {
          userName: 'testUser',
          password: 'testPassword',
          employeeNumber: 1234,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'genSalt').resolves(10);
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(User, 'create').resolves(null);
    
      await register(req, res);
    
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        message: 'An error occurred. Please try again later.',
      })).to.be.true;
    });

    it('should return 500 if an error occurs while registering a new user', async () => {
      const req = {
        body: {
          userName: 'testUser',
          password: 'testPassword',
          employeeNumber: 1234,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    
      sinon.stub(User, 'findOne').throws(new Error('Database error'));
    
      await register(req, res);
    
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        message: 'An error occurred. Please try again later.',
      })).to.be.true;
    });
    
  });
});
