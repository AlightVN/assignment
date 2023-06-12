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

  // ... thêm các bài kiểm tra khác liên quan đến Employee
});
