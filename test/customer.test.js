// Import required libraries
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const reToken = './auth.test';
const { loginUser } = require(reToken);

// Configure chai for HTTP requests
chai.use(chaiHttp);
chai.should();

let customerId;

// Customer test suite
describe('Customer Test', () => {
  let token;

  // Get the token for authentication before running tests
  before(async () => {
    const loginResponse = await loginUser();
    token = loginResponse.body.token;
  });

  // Test GET (fetch customers)
  it('Fetch list of customers', (done) => {
    chai.request(app)
      .get('/customers')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('array');
        done();
      });
  });

  // Test POST (create customer)
  it('Create new customer successfully', (done) => {
    const newCustomer = {
      customerName: "New Customer",
      contractLastName: "Doe",
      contractFirstName: "John",
      phone: "1234567890",
      addressLine1: "123 Main Street",
      addressLine2: null,
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      salesRepEmployeeNumber: 1,
      creditLimit: 1000,
    };
    
    chai.request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send(newCustomer)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql("Success");
        res.body.should.have.property('message').eql("Created customer successfully");
        customerId = res.body.data.customerNumber;
        done();
      });
  });

  // Test GET (fetch customer by ID)
  it('Fetch customer by newly created ID', (done) => {
    chai.request(app)
      .get(`/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        done();
      });
  });

  // Test PUT (update customer)
  it('Update customer successfully', (done) => {
    const updatedCustomer = {
      customerName: "Updated Customer",
      contactLastName: "Smith",
      contactFirstName: "Jane",
      phone: "0987654321",
      addressLine1: "456 Main Street",
      city: "New York",
      country: "USA"
    };
    
    chai.request(app)
      .put(`/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedCustomer)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Updated customer successfully');
        done();
      });
  });

  // Test DELETE (delete customer)
  it('Delete customer successfully', (done) => {
    chai.request(app)
      .delete(`/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(204);
        res.body.should.be.a('object');
        done();
      });
  });

});
