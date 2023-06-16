const sinon = require('sinon');
const { expect } = require('chai');
const EmployeeTest = require('../app/models/employeeTestModel');


describe('Employee Controller', () => {
  describe('GET /employees', () => {
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
        {
          employeeNumber: 2,
          firstName: 'Jane',
          lastName: 'Doe',
          extension: '5678',
          email: 'janedoe@example.com',
          officeCode: 2,
          reportsTo: 1,
          jobTitle: 'Assistant Manager',
          roleId: 2,
        },
      ];

      const findAllStub = sinon.stub(Employee, 'findAll').resolves(employees);

      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await employeeController.getEmployees(req, res, () => {
        console.log(res.body);
      });

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'Success', message: 'Retrieved employees successfully', data: employees })).to.be.true;

      findAllStub.restore();
    });
  });

  describe('POST /employees', () => {
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

      const createStub = sinon.stub(Employee, 'create').resolves(newEmployee);

      const req = {
        body: newEmployee,
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await employeeController.createEmployee(req, res, () => {});

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ status: 'Success', message: 'Employee created successfully', data: { id: newEmployee.employeeNumber } })).to.be.true;

      createStub.restore();
    });
  });

  describe('GET /employees/:id', () => {
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

      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(employee);

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await employeeController.getEmployeeById(req, res, () => {});

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'Success', message: 'Retrieved employee successfully', data: employee })).to.be.true;

      findByPkStub.restore();
    });
  });

  describe('PUT /employees/:id', () => {
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

      const saveStub = sinon.stub(Employee.prototype, 'save').resolves(updatedEmployee);

      const req = {
        params: {
          id: 1,
        },
        body: updatedEmployee,
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await employeeController.updateEmployeeById(req, res, () => {});

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'Success', message: 'Employee updated successfully', data: updatedEmployee })).to.be.true;

      saveStub.restore();
    });
  });

  describe('DELETE /employees/:id', () => {
    it('should delete an employee', async () => {
      const destroyStub = sinon.stub(Employee, 'destroy').resolves();

      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await employeeController.deleteEmployee(req, res, () => {});

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'Success', message: 'Employee deleted successfully' })).to.be.true;

      destroyStub.restore();
    });
  });
});
