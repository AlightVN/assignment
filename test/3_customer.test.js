// const chai = require('chai');
// const sinon = require('sinon');
// const { mockReq, mockRes } = require('sinon-express-mock');

// const CustomerController = require('../app/controllers/customerController');
// const { Customer, Employee } = require('../app/models');

// chai.should();

// describe('Customer Controller', () => {
//     afterEach(() => {
//         sinon.restore();
//     });

//     it('should get a list of customers', async () => {
//         const req = mockReq({
//             userData: { userName: 'testUser', role: 'admin' },
//         });
//         const res = mockRes();
//         const next = sinon.stub();

//         const customers = [
//             { id: 1, customerName: 'John Doe' },
//             { id: 2, customerName: 'Jane Doe' },
//         ];

//         sinon.stub(Customer, 'findAll').resolves(customers);

//         await CustomerController.getCustomers(req, res, next);

//         res.status.calledWith(200).should.be.true;
//         res.json.calledWith({
//             status: 'Success',
//             message: 'Retrieved customers successfully',
//             data: customers,
//         }).should.be.true;
//     });

//     it('should create a new customer', async () => {
//         const req = mockReq({
//             userData: { userName: 'testUser', role: 'admin' },
//             body: {
//                 customerName: 'John Doe',
//                 contactLastName: 'Doe',
//                 contactFirstName: 'John',
//                 phone: '123-456-7890',
//                 addressLine1: '123 Main St',
//                 addressLine2: '',
//                 city: 'New York',
//                 state: 'NY',
//                 postalCode: '10001',
//                 country: 'USA',
//                 salesRepEmployeeNumber: 1,
//                 creditLimit: 1000,
//             },
//         });
//         const res = mockRes();
//         const next = sinon.stub();

//         const createdCustomer = { ...req.body, customerNumber: 1 };
//         sinon.stub(Customer, 'create').resolves(createdCustomer);

//         await CustomerController.createCustomer(req, res, next);

//         res.status.calledWith(201).should.be.true;
//         res.json.calledWith({
//             status: 'Success',
//             message: 'Created customer successfully',
//             data: createdCustomer,
//         }).should.be.true;
//     });

//     it('should update a customer by ID', async () => {
//         const req = mockReq({
//             userData: { userName: 'testUser', role: 'admin' },
//             params: { id: 1 },
//             body: {
//                 customerName: 'John Doe',
//                 contactLastName: 'Doe',
//                 contactFirstName: 'John',
//             },
//         });
//         const res = mockRes();
//         const next = sinon.stub();

//         const customer = {
//             customerNumber: 1,
//             customerName: 'John Doe',
//             contactLastName: 'Doe',
//             contactFirstName: 'John',
//             save: sinon.stub().resolves(),
//         };
//         sinon.stub(Customer, 'findByPk').resolves(customer);

//         await CustomerController.updateCustomerById(req, res, next);

//         res.status.calledWith(200).should.be.true;
//         res.json.calledWith({
//             status: 'Success',
//             message: 'Updated customer successfully',
//             data: customer,
//         }).should.be.true;
//     });

//     it('should delete a customer by ID', async () => {
//         const req = mockReq({
//             userData: { userName: 'testUser', role: 'admin' },
//             params: { id: 1 },
//         });
//         const res = mockRes();
//         const next = sinon.stub();

//         const customer = { customerNumber: 1, destroy: sinon.stub().resolves() };
//         sinon.stub(Customer, 'findByPk').resolves(customer);

//         await CustomerController.deleteCustomer(req, res, next);

//         res.status.calledWith(204).should.be.true;
//         res.json.calledWith({
//             status: 'Success',
//             message: 'Deleted customer successfully',
//         }).should.be.true;
//     });

//     it('should get a customer by ID', async () => {
//         const req = mockReq({
//             userData: { userName: 'testUser', role: 'admin' },
//             params: { id: 1 },
//         });
//         const res = mockRes();
//         const next = sinon.stub();

//         const customer = { customerNumber: 1, customerName: 'John Doe' };
//         sinon.stub(Customer, 'findByPk').resolves(customer);

//         await CustomerController.getCustomerById(req, res, next);

//         res.status.calledWith(200).should.be.true;
//         res.json.calledWith({
//             status: 'Success',
//             message: 'Retrieved customer information successfully',
//             data: customer,
//         }).should.be.true;
//     });

// });
