const Employee = require('../models/employeeModel');
const logger = require('../database/winstonConfig');

// Get a list of employees
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    logger.info({ message: 'Retrieved employees successfully', userName: req.userData.userName });
    return res.status(200).json({
      status: 'Success',
      message: 'Retrieved employees successfully',
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new employee
const createEmployee = async (req, res, next) => {
  const { firstName, lastName, extension, email, officeCode, reportsTo, jobTitle } = req.body;
  try {
    const employee = await Employee.create({
      firstName, lastName, extension,
      email, officeCode,
      reportsTo, jobTitle,
    });
    logger.info({ message: 'Employee created successfully', userName: req.userData.userName });
    return res.status(201).json({
      status: 'Success',
      message: 'Employee created successfully',
      data: { id: employee.employeeNumber },
    });
  } catch (error) {
   next(error)
  }
};

// Update information of an employee
const updateEmployeeById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      logger.error({ message: `Employee not found: ${id}`, userName: req.userData.userName });
      return res.status(404).json({
        status: 'Not Found',
        message: 'Employee not found',
      });
    }

    const allowedUpdates = ['firstName', 'lastName', 'extension', 'email', 'officeCode', 'reportsTo', 'jobTitle'];
    for (const key in req.body) {
      if (allowedUpdates.includes(key)) {
        employee[key] = req.body[key];
      }
    }

    await employee.save();
    logger.info({ message: 'Employee updated successfully', userName: req.userData.userName });
    return res.status(200).json({
      status: 'Success',
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};


// Delete an employee
const deleteEmployee = async (req, res, next) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      logger.error({ message: `Employee not found: ${id}`, userName: req.userData.userName });
      return res.status(404).json({
        status: 'Not Found',
        message: 'Employee not found',
      });
    }
    await employee.destroy();
    logger.info({ message: 'Employee deleted successfully', userName: req.userData.userName });
    return res.status(200).json({
      status: 'Success',
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get detailed information about an employee
const getEmployeeById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      logger.error({ message: `Employee not found: id-${id}`, userName: req.userData.userName });
      return res.status(404).json({
        status: 'Not Found',
        message: 'Employee not found',
      });
    }
    logger.info({ message: 'Retrieved employee successfully', userName: req.userData.userName });
    return res.status(200).json({
      status: 'Success',
      message: 'Retrieved employee successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getEmployees,
  createEmployee,
  updateEmployeeById,
  deleteEmployee,
  getEmployeeById,
};
