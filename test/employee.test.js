// Import required libraries
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { loginUser } = require('./auth.test');

// Configure chai for HTTP requests
chai.use(chaiHttp);
chai.should();

let idTest;

// Employee test suite
describe('Employee Test', () => {
  let token;

  // Get the token for authentication before running tests
  before(async () => {
    const loginResponse = await loginUser();
    token = loginResponse.body.token;
  });

  // Test GET (fetch employees)
  it('Fetch list of employees', (done) => {
    chai.request(app)
      .get('/employees')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        done();
      });
  });

  // Test POST (create employee)
  it('Create new employee successfully', (done) => {
    const newEmployee = {
      firstName: "Alight",
      lastName: "Legend",
      extension: "Legend",
      email: "111@gmail.com",
      officeCode: 3,
      reportsTo: null,
      jobTitle: "president",
      roleId: 1
    };

    chai.request(app)
      .post('/employees')
      .set('Authorization', `Bearer ${token}`)
      .send(newEmployee)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql("Success");
        res.body.should.have.property('message').eql("Employee created successfully");
        idTest = res.body.data.id;
        done();
      });
  });

  // Test GET (fetch employee by ID)
  it('Fetch employee by newly created ID', (done) => {
    chai.request(app)
      .get(`/employees/${idTest}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        done();
      });
  });

  // Test PUT (update employee)
  it('Update employee successfully', (done) => {
    const updatedEmployee = {
      firstName: "Updated",
      extension: "Legend",
      email: "updated@gmail.com",
      officeCode:  3,
      reportsTo: 2,
      jobTitle: "president",
      roleId: 1
    };

    chai.request(app)
      .put(`/employees/${idTest}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedEmployee)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Employee updated successfully');
        done();
      });
  });

  // Test DELETE (delete employee)
  it('Delete employee successfully', (done) => {
    chai.request(app)
      .delete(`/employees/${idTest}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Employee deleted successfully');
        done();
      });
  });

});
