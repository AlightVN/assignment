const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const User = require('../app/models/userModel');
const UserController = require('../app/controller/userController');

describe('User Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should return a JWT token if username and password are valid', async () => {
      const userName = 'testUser';
      const password = 'testPassword';
      const user = {
        userName: 'testUser',
        password: await bcrypt.hash('testPassword', 10),
      };
      const req = { body: { userName, password } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };
      sinon.stub(User, 'findOne').resolves(user);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('mockedToken');

      await UserController.login(req, res);

      expect(User.findOne.calledOnceWith({ where: { userName } })).to.be.true;
      expect(bcrypt.compare.calledOnceWith(password, user.password)).to.be.true;
      expect(jwt.sign.calledOnceWith({ userName }, process.env.JWT_SECRET)).to.be.true;
      expect(res.json.calledOnceWith({
        status: 'Success',
        message: 'Login Account successfully',
        token: 'mockedToken',
      })).to.be.true;
    });

    it('should return an error if username or password is incorrect', async () => {
      const userName = 'testUser';
      const password = 'wrongPassword';
      const req = { body: { userName, password } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'compare').resolves(false);
    
      await UserController.login(req, res);
    
      User.findOne.calledOnceWith({ where: { userName } });
      bcrypt.compare.calledOnceWith(password, null);
      res.status.calledOnceWith(401);
      res.json.calledOnceWith({ message: 'Incorrect username or password. You trying to cheat?' });
    });
    
  });

  describe('register', () => {
    it('should return an error if an error occurs during user creation', async () => {
      const userName = 'newUser';
      const password = 'newPassword';
      const req = { body: { userName, password } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };
    
      sinon.stub(User, 'findOne').resolves(null);
    
      const createStub = sinon.stub(User, 'create');
      createStub.withArgs({ userName, password }).rejects(new Error('Mocked error'));
    
      await UserController.register(req, res);
    
      expect(User.findOne.calledOnceWith({ where: { userName } })).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({ message: 'An error occurred. Please try again later.' })).to.be.true;
    
      User.findOne.restore();
      createStub.restore();
    });
      
   it('should return an error if an error occurs during user creation', async () => {
     const userName = 'newUser';
     const password = 'newPassword';
     const req = { body: { userName, password } };
     const res = {
       json: sinon.spy(),
       status: sinon.stub().returnsThis(),
     };
     sinon.stub(User, 'findOne').resolves(null);
     sinon.stub(User, 'create').rejects(new Error('Mocked error'));
   
     await UserController.register(req, res);
   
      User.findOne.calledOnceWith({ where: { userName } });
     User.create.calledOnceWith({ userName, password });
     res.status.calledOnceWith(500);
  res.json.calledOnceWith({ message: 'An error occurred. Please try again later.' });
   });
  });
});
