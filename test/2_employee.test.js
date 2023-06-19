const chai = require('chai');
const sinon = require('sinon');
const { mockReq, mockRes } = require('sinon-express-mock');

const EmployeeController = require('../app/controller/employeeController');
const {Employee} = require('../app/models');


chai.should();

describe('Employee Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should get a list of employees', async () => {
    const req = mockReq({
      userData: { userName: 'testUser' },
    });
    const res = mockRes();
    const next = sinon.stub();

    const employees = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Doe' },
    ];

    sinon.stub(Employee, 'findAll').resolves(employees);

    await EmployeeController.getEmployees(req, res, next);

    res.status.calledWith(200).should.be.true;
    res.json.calledWith({
      status: 'Success',
      message: 'Retrieved employees successfully',
      data: employees,
    }).should.be.true;
  });

  // Test case for createEmployee
it('should create a new employee', async () => {
    const req = mockReq({
      userData: { userName: 'testUser' },
      body: {
        firstName: 'John',
        lastName: 'Doe',
        extension: '1234',
        email: 'john.doe@example.com',
        officeCode: 1,
        reportsTo: 2,
        jobTitle: 'Software Engineer',
        roleId: 1,
      },
    });
    const res = mockRes();
    const next = sinon.stub();
  
    const createdEmployee = { ...req.body, employeeNumber: 1 };
    sinon.stub(Employee, 'create').resolves(createdEmployee);
  
    await EmployeeController.createEmployee(req, res, next);
  
    res.status.calledWith(201).should.be.true;
    res.json.calledWith({
      status: 'Success',
      message: 'Employee created successfully',
      data: { id: createdEmployee.employeeNumber },
    }).should.be.true;
  });
  
  // Test case for updateEmployeeById
  it('should update an employee by ID', async () => {
    const req = mockReq({
      userData: { userName: 'testUser' },
      params: { id: 1 },
      body: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });
    const res = mockRes();
    const next = sinon.stub();
  
    const employee = {
      employeeNumber: 1,
      firstName: 'John',
      lastName: 'Doe',
      save: sinon.stub().resolves(),
    };
    sinon.stub(Employee, 'findByPk').resolves(employee);
  
    await EmployeeController.updateEmployeeById(req, res, next);
  
    res.status.calledWith(200).should.be.true;
    res.json.calledWith({
      status: 'Success',
      message: 'Employee updated successfully',
      data: employee,
    }).should.be.true;
  });
  
  // Test case for deleteEmployee
  it('should delete an employee by ID', async () => {
    const req = mockReq({
      userData: { userName: 'testUser' },
      params: { id: 1 },
    });
    const res = mockRes();
    const next = sinon.stub();
  
    const employee = { employeeNumber: 1, destroy: sinon.stub().resolves() };
    sinon.stub(Employee, 'findByPk').resolves(employee);
  
    await EmployeeController.deleteEmployee(req, res, next);
  
    res.status.calledWith(200).should.be.true;
    res.json.calledWith({
      status: 'Success',
      message: 'Employee deleted successfully',
    }).should.be.true;
  });
  
  // Test case for getEmployeeById
  it('should get an employee by ID', async () => {
    const req = mockReq({
      userData: { userName: 'testUser' },
      params: { id: 1 },
    });
    const res = mockRes();
    const next = sinon.stub();
  
    const employee = { employeeNumber: 1, firstName: 'John', lastName: 'Doe' };
    sinon.stub(Employee, 'findByPk').resolves(employee);
  
    await EmployeeController.getEmployeeById(req, res, next);
  
    res.status.calledWith(200).should.be.true;
    res.json.calledWith({
      status: 'Success',
      message: 'Retrieved employee successfully',
      data: employee,
    }).should.be.true;
  });
  
});
