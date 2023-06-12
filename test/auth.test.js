const chai = require('chai');
const chaiHttp = require('chai-http');
const { Employee, User, Permission } = require('../app/models');
const app = require('../index');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);

let token;

async function loginUser() {
  const res = await chai.request(app)
    .post('/user/login')
    .send({ userName: 'testuser', password: 'Test@123' });

  token = res.body.token;
  return res;
}
describe('POST /users', () => {
  before(async () => {
    // Xóa tất cả dữ liệu người dùng hiện có trước mỗi bài kiểm tra
    await User.destroy({ where: {} });
  });
  it('Tạo người dùng mới thành công', (done) => {
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

  it('Tạo người dùng mới thất bại với dữ liệu không hợp lệ', (done) => {
    const invalidUser = {
      userName: 'te',
      password: 'Test123',
      employeeNumber: 1,
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

  it('Đăng nhập người dùng với thông tin hợp lệ', (done) => {
    loginUser().then((res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      done();
    });
  });

});
module.exports = {
  loginUser,
};