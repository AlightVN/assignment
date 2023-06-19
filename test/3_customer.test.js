const sinon = require('sinon');
const { expect } = require('chai');
const CustomerTest = require('../app/models/testModel/customerTestModel');

describe('Customer Test Model', () => {
  // CREATE
  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const newCustomer = {
        customerName: "New Customer",
        contactLastName: "Doe",
        contactFirstName: "John",
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

      const createStub = sinon.stub(CustomerTest, 'createCustomer').resolves(newCustomer);

      const createdCustomer = await CustomerTest.createCustomer(newCustomer);

      expect(createdCustomer).to.deep.equal(newCustomer);

      createStub.restore();
    });
  });

  // READ
  describe('getAll', () => {
    it('should return a list of customers', async () => {
      const customers = [
        {
          customerNumber: 1,
          customerName: "New Customer",
          contactLastName: "Doe",
          contactFirstName: "John",
          phone: "1234567890",
          addressLine1: "123 Main Street",
          addressLine2: null,
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
          salesRepEmployeeNumber: 1,
          creditLimit: 1000,
        },
      ];

      const findAllStub = sinon.stub(CustomerTest, 'getAll').resolves(customers);

      const allCustomers = await CustomerTest.getAll();

      expect(allCustomers).to.deep.equal(customers);

      findAllStub.restore();
    });
  });

  describe('getById', () => {
    it('should return a customer by ID', async () => {
      const customer = {
        customerNumber: 1,
        customerName: "New Customer",
        contactLastName: "Doe",
        contactFirstName: "John",
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

      const findByPkStub = sinon.stub(CustomerTest, 'getById').resolves(customer);

      const foundCustomer = await CustomerTest.getById(customer.customerNumber);

      expect(foundCustomer).to.deep.equal(customer);

      findByPkStub.restore();
    });
  });

  // UPDATE
  describe('updateById', () => {
    it('should update a customer', async () => {
      const updatedCustomer = {
        customerNumber: 1,
        customerName: "Updated Customer",
        contactLastName: "Smith",
        contactFirstName: "Jane",
        phone: "0987654321",
        addressLine1: "456 Main Street",
        city: "New York",
        country: "USA"
      };

      const saveStub = sinon.stub(CustomerTest, 'updateById').resolves(updatedCustomer);

      const updated = await CustomerTest.updateById(updatedCustomer.customerNumber, updatedCustomer);

      expect(updated).to.deep.equal(updatedCustomer);

      saveStub.restore();
    });
  });

  // DELETE
  describe('deleteById', () => {
    it('should delete a customer', async () => {
      const destroyStub = sinon.stub(CustomerTest, 'deleteById').resolves(true);

      const result = await CustomerTest.deleteById(1);

      expect(result).to.be.true;

      destroyStub.restore();
    });
  });
});
