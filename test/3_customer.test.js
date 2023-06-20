const { expect } = require('chai');
const sinon = require('sinon');
const { Customer, Employee } = require('../app/models');
const {
  getCustomers,
  createCustomer,
  updateCustomerById,
  deleteCustomer,
  getCustomerById,
} = require('../app/controllers/customerController');

describe('Customer Controller', () => {
  describe('getCustomers', () => {
    let findAllStub;

    beforeEach(() => {
      findAllStub = sinon.stub(Customer, 'findAll');
    });

    afterEach(() => {
      findAllStub.restore();
    });

    it('should retrieve a list of customers', async () => {
      findAllStub.resolves(['customer1', 'customer2']);

      const req = {};
      const jsonStub = sinon.stub();
      const res = {
        status: sinon.stub().returns({
          json: jsonStub,
        }),
      };
      const next = sinon.stub();

      await getCustomers(req, res, next);

      expect(res.status().json.called).to.be.false;
      expect(res.status().json.calledWith({
        status: 'Success',
        message: 'Retrieved customers successfully',
        data: ['customer1', 'customer2'],
      })).to.be.true;
    });

    it('should handle errors when retrieving customers', async () => {
      const error = new Error('Database error');
      findAllStub.throws(error);

      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await getCustomers(req, res, next);

      expect(next.calledWithExactly(error)).to.be.false;
      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.false;
    });
    
    it('should retrieve customers for staff members', async () => {
      const staffUser = {
        role: 'staff',
        employeeNumber: 123,
      };
    
      const findAllStub = sinon.stub(Customer, 'findAll').resolves(['customer1', 'customer2']);
    
      const req = {
        userData: staffUser,
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await getCustomers(req, res, next);
    
      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where).to.deep.equal({
        salesRepEmployeeNumber: staffUser.employeeNumber,
      });
      expect(res.status().json.calledWithExactly({
        status: 'Success',
        message: 'Retrieved customers successfully',
        data: ['customer1', 'customer2'],
      })).to.be.true;
    
      findAllStub.restore();
    });
    
    
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const createStub = sinon.stub(Customer, 'create').resolves({ customerNumber: 1 });

      const req = {
        body: {
          customerName: 'John Doe',
          contactLastName: 'Doe',
          contactFirstName: 'John',
          phone: '123-456-7890',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
          salesRepEmployeeNumber: 1,
          creditLimit: 10000,
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await createCustomer(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Created customer successfully',
        data: { customerNumber: 1 },
      })).to.be.true;

      createStub.restore();
    });

    it('should handle errors when creating a customer', async () => {
      const error = new Error('Database error');
      const createStub = sinon.stub(Customer, 'create').throws(error);

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

      await createCustomer(req, res, next);

      expect(next.calledWith(error)).to.be.true;

      createStub.restore();
    });
  });

  describe('updateCustomerById', () => {
    it('should update information of a customer', async () => {
      const customer = {
        save: sinon.stub(),
      };
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(customer);

      const req = {
        params: {
          id: 1,
        },
        body: {
          customerName: 'Jane Doe',
        },
        userData: {
          userName: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await updateCustomerById(req, res);

      expect(customer.customerName).to.equal('Jane Doe');
      expect(customer.save.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Updated customer successfully',
        data: customer,
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should handle errors when updating a customer', async () => {
      const error = new Error('Database error');
      const findByPkStub = sinon.stub(Customer, 'findByPk').throws(error);

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

      await updateCustomerById(req, res, next);

      expect(next.calledWith(error)).to.be.true;

      findByPkStub.restore();
    });

    it('should handle not found error when updating a customer', async () => {
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(null);

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

      await updateCustomerById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(404);
      expect(next.args[0][0].message).to.equal('Customer not found');

      findByPkStub.restore();
    });

    it('should handle forbidden error when creating a customer for another employee as staff', async () => {
      const createStub = sinon.stub(Customer, 'create');
    
      const req = {
        body: {
          salesRepEmployeeNumber: 2, // Assuming the user is staff and their employeeNumber is 1
        },
        userData: {
          role: 'staff',
          employeeNumber: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await createCustomer(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to create a customer for another employee.');
      expect(error.statusCode).to.equal(403);
    
      createStub.restore();
    });
    
    it('should handle forbidden error when creating a customer for an employee in another office as leader', async () => {
      const employeesInSameOffice = [
        { employeeNumber: 2 },
        { employeeNumber: 3 },
      ];
      const findAllStub = sinon.stub(Employee, 'findAll').resolves(employeesInSameOffice);
      const createStub = sinon.stub(Customer, 'create');
    
      const req = {
        body: {
          salesRepEmployeeNumber: 4, // Assuming the user is leader and their officeCode matches one of the employees
        },
        userData: {
          role: 'leader',
          officeCode: 'NY', // Assuming the user's officeCode is 'NY'
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await createCustomer(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to create a customer for an employee in another office.');
      expect(error.statusCode).to.equal(403);
    
      findAllStub.restore();
      createStub.restore();
    });

    it('should handle forbidden error when updating another employee\'s customer as staff', async () => {
      const customer = {
        salesRepEmployeeNumber: 2, // Assuming the customer's salesRepEmployeeNumber is 2
        save: sinon.stub(),
      };
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(customer);
    
      const req = {
        params: {
          id: 1,
        },
        body: {
          customerName: 'Jane Doe',
        },
        userData: {
          role: 'staff',
          employeeNumber: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await updateCustomerById(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to update another employee\'s customer.');
      expect(error.statusCode).to.equal(403);
    
      findByPkStub.restore();
    });
    
    it('should handle forbidden error when updating a customer for an employee in another office as leader', async () => {
      const customer = {
        salesRepEmployeeNumber: 4, // Assuming the customer's salesRepEmployeeNumber is 4
        save: sinon.stub(),
      };
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(customer);
      const employeesInSameOffice = [
        { employeeNumber: 2 },
        { employeeNumber: 3 },
      ];
      const findAllStub = sinon.stub(Employee, 'findAll').resolves(employeesInSameOffice);
    
      const req = {
        params: {
          id: 1,
        },
        body: {
          customerName: 'Jane Doe',
        },
        userData: {
          role: 'leader',
          officeCode: 'NY', // Assuming the user's officeCode is 'NY'
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await updateCustomerById(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to update a customer for an employee in another office.');
      expect(error.statusCode).to.equal(403);
    
      findByPkStub.restore();
      findAllStub.restore();
    });
    
    
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      const customer = {
        destroy: sinon.stub(),
      };
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(customer);

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

      await deleteCustomer(req, res);

      expect(customer.destroy.calledOnce).to.be.true;
      expect(res.status.calledWith(204)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Deleted customer successfully',
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should handle errors when deleting a customer', async () => {
      const error = new Error('Database error');
      const findByPkStub = sinon.stub(Customer, 'findByPk').throws(error);

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

      await deleteCustomer(req, res, next);

      expect(next.calledWith(error)).to.be.true;

      findByPkStub.restore();
    });

    it('should handle not found error when deleting a customer', async () => {
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(null);

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

      await deleteCustomer(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0].statusCode).to.equal(404);
      expect(next.args[0][0].message).to.equal('Customer not found');

      findByPkStub.restore();
    });

    it('should handle forbidden error when deleting a customer as staff', async () => {
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves({});
    
      const req = {
        params: {
          id: 1,
        },
        userData: {
          role: 'staff',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await deleteCustomer(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to delete a customer.');
      expect(error.statusCode).to.equal(403);
    
      findByPkStub.restore();
    });
    
    it('should handle forbidden error when deleting a customer for an employee in another office as leader', async () => {
      const employeesInSameOffice = [
        { employeeNumber: 2 },
        { employeeNumber: 3 },
      ];
      const findAllStub = sinon.stub(Employee, 'findAll').resolves(employeesInSameOffice);
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves({
        salesRepEmployeeNumber: 4,
      });
    
      const req = {
        params: {
          id: 1,
        },
        userData: {
          role: 'leader',
          officeCode: 'NY',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await deleteCustomer(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to delete a customer for an employee in another office.');
      expect(error.statusCode).to.equal(403);
    
      findAllStub.restore();
      findByPkStub.restore();
    });
    
  });

  describe('getCustomerById', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it('should retrieve a customer by ID', async () => {
      const customer = { customerName: 'John Doe' };
      const findByPkStub = sandbox.stub(Customer, 'findByPk').resolves(customer);
    
      const req = {
        params: {
          id: 1,
        },
        userData: {
          role: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
    
      await getCustomerById(req, res);
    
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'Success',
        message: 'Retrieved customer information successfully',
        data: customer,
      })).to.be.true;
    
      findByPkStub.restore();
    });
    

    it('should handle errors when retrieving a customer by ID', async () => {
      const error = new Error('Database error');
    const findByPkStub = sandbox.stub(Customer, 'findByPk').throws(error);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          role: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await getCustomerById(req, res, next);

      expect(next.calledWith(error)).to.be.true;

    findByPkStub.restore();
    });

    it('should handle not found error when retrieving a customer by ID', async () => {
      const findByPkStub = sandbox.stub(Customer, 'findByPk').resolves(null);

      const req = {
        params: {
          id: 1,
        },
        userData: {
          role: 'admin',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      await getCustomerById(req, res, next);

      expect(next.calledOnce).to.be.true;
    expect(next.args[0][0].statusCode).to.equal(404);
    expect(next.args[0][0].message).to.equal('Customer not found');

    findByPkStub.restore();
    });
    it('should handle forbidden error when accessing customer information as staff', async () => {
      const customer = {
        salesRepEmployeeNumber: 'john',
      };
      const findByPkStub = sandbox.stub(Customer, 'findByPk').resolves(customer);
    
      const req = {
        params: {
          id: 1,
        },
        userData: {
          role: 'staff',
          userName: 'jane',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await getCustomerById(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to access this customer information.');
      expect(error.statusCode).to.equal(403);
    
      findByPkStub.restore();
    });
    
    it('should handle forbidden error when accessing customer information for an employee in another office as leader', async () => {
      const customer = {
        salesRep: {
          officeCode: 'NY',
        },
      };
      const findByPkStub = sandbox.stub(Customer, 'findByPk').resolves(customer);
    
      const req = {
        params: {
          id: 1,
        },
        userData: {
          role: 'leader',
          userName: 'admin',
          officeCode: 'LA',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();
    
      await getCustomerById(req, res, next);
    
      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.equal('You are not allowed to access this customer information.');
      expect(error.statusCode).to.equal(403);
    
      findByPkStub.restore();
    });
    
  });

});

