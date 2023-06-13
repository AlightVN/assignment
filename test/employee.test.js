const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { loginUser } = require('./auth.test');

chai.use(chaiHttp);
chai.should();

describe('Employee Test', () => {
  let token;

  before(async () => {
    const loginResponse = await loginUser();
    token = loginResponse.body.token;
  });

  // Các bài kiểm tra khác cho employee
  it('Lấy danh sách Employee', (done) => {
    chai.request(app)
      .get('/employees')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        done();
      });
  });
  //test post 
  it('Tạo employees mới thành công', (done) => {
    const newEmployee = {
      firstName: "Alight",
      extension: "Legend",
      email: "111@gmail.com",
      officeCode: "PA_HY",
      reportTo: 2,
      jobTitle: "president"
    };

    chai.request(app)
      .post('/employees')
      .send(newEmployee)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user');
        res.body.user.should.have.property('userName').eql(newEmployee.userName);
        res.body.user.should.have.property('employeeNumber').eql(newEmployee.employeeNumber);
        res.body.should.have.property('token');
        done();
      });
  });
  // ... thêm các bài kiểm tra khác liên quan đến Employee
});
