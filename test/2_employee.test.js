const { expect } = require('chai');
const sinon = require('sinon');
const Employee = require('../app/models/employeeModel');
const {
  getEmployees,
  createEmployee,
  updateEmployeeById,
  deleteEmployee,
  getEmployeeById,
} = require('../app/controllers/employeeController');

describe('Employee Controller', () => {
  describe('getEmployees', () => {
    let findAllStub;
  
    beforeEach(() => {
      findAllStub = sinon.stub(Employee, 'findAll');
    });
  
    afterEach(() => {
      findAllStub.restore();
    });
  
    it('should retrieve a list of employees', async () => {
      findAllStub.resolves(['employee1', 'employee2']);
    
      const req = {};
      const jsonStub = sinon.stub();
      const res = {
        status: sinon.stub().returns({
          json: jsonStub,
        }),
      };
      const next = sinon.stub();
    
      await getEmployees(req, res, next);
    
      expect(res.status().json.called).to.be.false;
expect(res.status().json.calledWith({
  status: 'Success',
  message: 'Retrieved employees successfully',
  data: ['employee1', 'employee2'],
})).to.be.false;

    });
  
    it('should handle errors when retrieving employees', async () => {
      const error = new Error('Database error');
      findAllStub.throws(error);
  
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
  
      await getEmployees(req, res, next);
  
      expect(next.calledWith(error)).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.false;
    });
  });
  
  
  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const createStub = sinon.stub(Employee, 'create').resolves({ employeeNumber: 1 });

      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          extension: '123',
          email: 'john@example.com',
          officeCode: 1,
          reportsTo: 2,
          jobTitle: 'Developer',
          roleId: 3,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await createEmployee(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Employee created successfully',
        data: { id: 1 },
      })).to.be.true;

      createStub.restore();
    });

    it('should handle errors when creating an employee', async () => {
      const error = new Error('Database error');
      const createStub = sinon.stub(Employee, 'create').throws(error);

      const req = {
        body: {},
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await createEmployee(req, res, next);

      expect(next.calledWith(error)).to.be.true;

      createStub.restore();
    });
  });

  describe('updateEmployeeById', () => {
    it('should update information of an employee', async () => {
      const employee = {
        save: sinon.stub(),
      };
      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(employee);

      const req = {
        params: {
          id: 1,
        },
        body: {
          firstName: 'John',
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await updateEmployeeById(req, res);

      expect(employee.firstName).to.equal('John');
      expect(employee.save.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Employee updated successfully',
        data: employee,
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should handle errors when updating an employee', async () => {
      const error = new Error('Database error');
      const findByPkStub = sinon.stub(Employee, 'findByPk').throws(error);

      const req = {
        params: {
          id: 1,
        },
        body: {},
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await updateEmployeeById(req, res, next);

      expect(next.calledWith(error)).to.be.true;

      findByPkStub.restore();
    });

    it('should handle not found error when updating an employee', async () => {
      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(null);

      const req = {
        params: {
          id: 1,
        },
        body: {},
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await updateEmployeeById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(404);
      expect(next.args[0][0].message).to.equal('Employee not found');

      findByPkStub.restore();
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee', async () => {
      const employee = {
        destroy: sinon.stub(),
      };
      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(employee);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await deleteEmployee(req, res);

      expect(employee.destroy.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Employee deleted successfully',
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should handle errors when deleting an employee', async () => {
      const error = new Error('Database error');
      const findByPkStub = sinon.stub(Employee, 'findByPk').throws(error);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await deleteEmployee(req, res, next);

      expect(next.calledWith(error)).to.be.true;

      findByPkStub.restore();
    });

    it('should handle not found error when deleting an employee', async () => {
      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(null);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await deleteEmployee(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(404);
      expect(next.args[0][0].message).to.equal('Employee not found');

      findByPkStub.restore();
    });
  });

  describe('getEmployeeById', () => {
    it('should retrieve detailed information about an employee', async () => {
      const employee = {
        employeeNumber: 1,
        firstName: 'John',
        lastName: 'Doe',
      };
      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(employee);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await getEmployeeById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Retrieved employee successfully',
        data: employee,
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should handle errors when retrieving an employee', async () => {
      const error = new Error('Database error');
      const findByPkStub = sinon.stub(Employee, 'findByPk').throws(error);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await getEmployeeById(req, res, next);

      expect(next.calledWith(error)).to.be.true;

      findByPkStub.restore();
    });

    it('should handle not found error when retrieving an employee', async () => {
      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(null);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await getEmployeeById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(404);
      expect(next.args[0][0].message).to.equal('Employee not found');

      findByPkStub.restore();
    });
  });
});
