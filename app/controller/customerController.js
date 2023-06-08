// Import required modules
const { Customer, Employee } = require('../models');
const { Op } = require('sequelize');
const logger = require('../database/winstonConfig');

// Get a list of customers
const getCustomers = async (req, res, next) => {
  try {
    const queryOptions = {};

    // If the user is a staff member, they can only see their own customers
    if (req.userData.role === 'staff') {
      queryOptions.salesRepEmployeeNumber = req.userData.employeeNumber;
    }

    // If the user is a leader, they can only see customers that belong to employees in the same office
    if (req.userData.role === 'leader') {
      const employeesInSameOffice = await Employee.findAll({
        where: { officeCode: req.userData.officeCode },
        attributes: ['employeeNumber'],
      });
      const employeeNumbersInSameOffice = employeesInSameOffice.map((e) => e.employeeNumber);

      queryOptions.salesRepEmployeeNumber = {
        [Op.in]: employeeNumbersInSameOffice,
      };
    }

    // Retrieve all customers from the database
    const customers = await Customer.findAll({ where: queryOptions });
    logger.info({ message: 'Retrieved customers successfully', userName: req.userData.userName });
    return res.status(200).json({
      status: 'Success',
      message: 'Retrieved customers successfully',
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new customer
const createCustomer = async (req, res, next) => {
  const {
    contractLastName, contractFirstName, phone, addressLine1,
    addressLine2, city, state, postalCode,
    country, salesRepEmployeeNumber, creditLimit,
  } = req.body;

  try {
    // Check if the user has permission to create a customer for the specified salesRepEmployeeNumber
    if (req.userData.role === 'staff' && req.userData.employeeNumber !== salesRepEmployeeNumber) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You are not allowed to create a customer for another employee.',
      });
    }
    if (req.userData.role === 'leader') {
      const employeesInSameOffice = await Employee.findAll({
        where: { officeCode: req.userData.officeCode },
        attributes: ['employeeNumber'],
      });
      const employeeNumbersInSameOffice = employeesInSameOffice.map((e) => e.employeeNumber);

      if (!employeeNumbersInSameOffice.includes(salesRepEmployeeNumber)) {
        return res.status(403).json({
          status: 'Forbidden',
          message: 'You are not allowed to create a customer for an employee in another office.',
        });
      }
    }

    // Create a new customer record in the database
    const customer = await Customer.create({
      contractLastName, contractFirstName, phone,
      addressLine1, addressLine2, city,
      state, postalCode, country,
      salesRepEmployeeNumber, creditLimit,
    });
    logger.info({ message: 'Created customers successfully', userName: req.userData.userName });
    return res.status(201).json({
      status: 'Success',
      message: 'Created customer successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update information of a customer
const updateCustomerById = async (req, res, next) => {
  const allowedFields = [
    'contractLastName', 'contractFirstName', 'phone',
    'addressLine1', 'addressLine2', 'city',
    'state', 'postalCode', 'country',
    'salesRepEmployeeNumber', 'creditLimit',
  ];
  const { id } = req.params;
  try {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      logger.error(`Customer not found: ${id}`);
      return res.status(404).json({
        status: 'Not Found',
        message: 'Customer not found',
      });
    }

    // Check if the user has permission to update the customer
    if (req.userData.role === 'staff' && req.userData.employeeNumber !== customer.salesRepEmployeeNumber) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You are not allowed to update another employee\'s customer.',
      });
    }

    if (req.userData.role === 'leader') {
      const employeesInSameOffice = await Employee.findAll({
        where: { officeCode: req.userData.officeCode },
        attributes: ['employeeNumber'],
      });
      const employeeNumbersInSameOffice = employeesInSameOffice.map((e) => e.employeeNumber);

      if (!employeeNumbersInSameOffice.includes(customer.salesRepEmployeeNumber)) {
        return res.status(403).json({
          status: 'Forbidden',
          message: 'You are not allowed to update a customer for an employee in another office.',
        });
      }
    }

    // Update allowed fields of the customer object
    for (const field of allowedFields) {
      if (req.body[field]) {
        customer[field] = req.body[field];
      }
    }

    // Save the updated customer to the database
    await customer.save();
    logger.info({ message: 'Created customers successfully', userName: req.userData.userName });
    return res.status(200).json({
      status: 'Success',
      message: 'Updated customer successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a customer
const deleteCustomer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      logger.error(`Customer not found: ${id}`);
      return res.status(404).json({
        status: 'Not Found',
        message: 'Customer not found',
      });
    }

    // Check if the user has permission to delete the customer
    if (req.userData.role === 'staff') {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You are not allowed to delete a customer.',
      });
    }

    if (req.userData.role === 'leader') {
      const employeesInSameOffice = await Employee.findAll({
        where: { officeCode: req.userData.officeCode },
        attributes: ['employeeNumber'],
      });
      const employeeNumbersInSameOffice = employeesInSameOffice.map((e) => e.employeeNumber);

      if (!employeeNumbersInSameOffice.includes(customer.salesRepEmployeeNumber)) {
        return res.status(403).json({
          status: 'Forbidden',
          message: 'You are not allowed to delete a customer for an employee in another office.',
        });
      }
    }

    // Delete the customer record from the database
    await customer.destroy();
    logger.info({ message: 'Deleted customers successfully', userName: req.userData.userName });
    return res.status(204).json({
      status: 'Success',
      message: 'Deleted customer successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get detailed information of a customer
const getCustomerById = async (req, res, next) => {
  const { id } = req.params;
  const { role, userName } = req.userData;

  try {
    // Find the customer by primary key
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'salesRep',
          where: {
            officeCode: Sequelize.col('Employee.officeCode'),
          },
        },
      ],
    });

    if (!customer) {
      logger.error(`Customer not found: id-${id}`);
      return res.status(404).json({
        status: 'Not Found',
        message: 'Customer not found',
      });
    }

    // Check user's role and their associated customers
    if (
      role === 'staff' &&
      customer.salesRepEmployeeNumber !== userName ||
      role === 'leader' &&
      customer.salesRep.officeCode !== req.userData.officeCode
    ) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You are not allowed to access this customer information.',
      });
    }

    // Return the retrieved customer information
    logger.info({ message: 'Retrieved customers successfully', userName: req.userData.userName });
    return res.status(200).json({
      status: 'Success',
      message: 'Retrieved customer successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};


// Export controller functions
module.exports = {
  getCustomers,
  createCustomer,
  updateCustomerById,
  deleteCustomer,
  getCustomerById,
};
