const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const TestUser = require('../app/models/testModel/userTestModel');

describe('User', () => {
  describe('#register', () => {
    beforeEach(() => {
      sinon.restore(); // Khôi phục tất cả các stub trước mỗi bài kiểm tra
    });

    it('should create a new user', async () => {
      const fakeUsername = 'john.doe';
      const fakePassword = 'password123';
      const fakeEncryptedPassword = 'encrypted-password';
      const fakeUserData = { id: 1, username: fakeUsername };

      const bcryptStub = sinon.stub(bcrypt, 'hashSync').returns(fakeEncryptedPassword);
      const createStub = sinon.stub(TestUser, 'create').resolves(fakeUserData);

      const result = await TestUser.register(fakeUsername, fakePassword);

      expect(result).to.deep.equal(fakeUserData);
      expect(bcryptStub.calledOnceWith(fakePassword, sinon.match.number)).to.be.true;
      expect(createStub.calledOnceWith({ userName: fakeUsername, password: fakeEncryptedPassword })).to.be.true;
    });
  });

  describe('#login', () => {
    beforeEach(() => {
      sinon.restore(); // Khôi phục tất cả các stub trước mỗi bài kiểm tra
    });

    it('should log in with valid credentials', async () => {
      const fakeUsername = 'john.doe';
      const fakePassword = 'password123';
      const fakeEncryptedPassword = 'encrypted-password';
      const fakeUserData = { id: 1, username: fakeUsername, password: fakeEncryptedPassword };

      const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);
      const findOneStub = sinon.stub(TestUser, 'findOne').resolves(fakeUserData);

      const result = await TestUser.login(fakeUsername, fakePassword);

      expect(result).to.deep.equal(fakeUserData);
      expect(bcryptStub.calledOnceWith(fakePassword, fakeEncryptedPassword)).to.be.true;
      expect(findOneStub.calledOnceWith({ where: { userName: fakeUsername } })).to.be.true;
    });

    it('should throw an error with invalid credentials', async () => {
      const fakeUsername = 'john.doe';
      const fakePassword = 'password123';

      const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false);
      const findOneStub = sinon.stub(TestUser, 'findOne').resolves(null);

      try {
        await TestUser.login(fakeUsername, fakePassword);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid credentials');
      }
    });
  });
});
