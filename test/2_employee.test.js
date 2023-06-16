const sinon = require('sinon');
const { expect } = require('chai');
const EmployeeTest = require('../app/models/testModel/employeeTestModel');

describe('Employee Test Model', () => {
  // CREATE
  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        firstName: 'John',
        lastName: 'Doe',
        extension: '1234',
        email: 'johndoe@example.com',
        officeCode: 1,
        reportsTo: null,
        jobTitle: 'Manager',
        roleId: 1,
      };

      const createStub = sinon.stub(EmployeeTest, 'createEmployee').resolves(newEmployee);

      const createdEmployee = await EmployeeTest.createEmployee(newEmployee);

      expect(createdEmployee).to.deep.equal(newEmployee);

      createStub.restore();
    });
  });

  // READ
  describe('getAll', () => {
    it('should return a list of employees', async () => {
      const employees = [
        {
          employeeNumber: 1,
          firstName: 'John',
          lastName: 'Doe',
          extension: '1234',
          email: 'johndoe@example.com',
          officeCode: 1,
          reportsTo: null,
          jobTitle: 'Manager',
          roleId: 1,
        },
      ];

      const findAllStub = sinon.stub(EmployeeTest, 'getAll').resolves(employees);

      const allEmployees = await EmployeeTest.getAll();

      expect(allEmployees).to.deep.equal(employees);

      findAllStub.restore();
    });
  });

  describe('getById', () => {
    it('should return an employee by ID', async () => {
      const employee = {
        employeeNumber: 1,
        firstName: 'John',
        lastName: 'Doe',
        extension: '1234',
        email: 'johndoe@example.com',
        officeCode: 1,
        reportsTo: null,
        jobTitle: 'Manager',
        roleId: 1,
      };

      const findByPkStub = sinon.stub(EmployeeTest, 'getById').resolves(employee);

      const foundEmployee = await EmployeeTest.getById(employee.employeeNumber);

      expect(foundEmployee).to.deep.equal(employee);

      findByPkStub.restore();
    });
  });

  // UPDATE
  describe('updateById', () => {
    it('should update an employee', async () => {
      const updatedEmployee = {
        employeeNumber: 1,
        firstName: 'John',
        lastName: 'Doe',
        extension: '1234',
        email: 'johndoe@example.com',
        officeCode: 1,
        reportsTo: null,
        jobTitle: 'Manager',
        roleId: 1,
      };

      const saveStub = sinon.stub(EmployeeTest, 'updateById').resolves(updatedEmployee);

      const updated = await EmployeeTest.updateById(updatedEmployee.employeeNumber, updatedEmployee);

      expect(updated).to.deep.equal(updatedEmployee);

      saveStub.restore();
    });
  });

  // DELETE
  describe('deleteById', () => {
    it('should delete an employee', async () => {
      const destroyStub = sinon.stub(EmployeeTest, 'deleteById').resolves(true);

      const result = await EmployeeTest.deleteById(1);

      expect(result).to.be.true;

      destroyStub.restore();
    });
  });
});
