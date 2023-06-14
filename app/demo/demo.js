// node app/demo/demo.js
const sequelize = require('../database/configDB');
const Customer = require('../models/customerModel');
const Employee = require('../models/employeeModel');
const Permission = require('../models/permissionModel'); // Import Permission model
const Office = require('../models/officeModel');

// sample
const sampleCustomers = require('./sampleCustomer');
const sampleEmployees = require('./sampleEmployees');
const samplePermissions = require('./samplePermissions'); // Import sample permissions
const sampleOffices = require('./sampleOffice');

// add demo customers
const insertCustomers = async () => {
  try {
    await Customer.bulkCreate(sampleCustomers);
    console.log('Sample customers created successfully');
  } catch (error) {
    console.error('Error creating sample customers:', error);
  }
};

// add demo office
const insertOffices = async () => {
  try {
    await Office.bulkCreate(sampleOffices);
    console.log('Sample offices created successfully');
  } catch (error) {
    console.error('Error creating sample offices:', error);
  }
};
// add demo employees
const insertSampleEmployees = async () => {
  try {
    await Employee.bulkCreate(sampleEmployees);
    console.log('Sample employees created successfully');
  } catch (error) {
    console.error('Error creating sample employees:', error);
  }
};

// add demo permissions
const insertSamplePermissions = async () => {
  try {
    await Permission.bulkCreate(samplePermissions);
    console.log('Sample permissions created successfully');
  } catch (error) {
    console.error('Error creating sample permissions:', error);
  }
};

(async () => {
  try {
    await sequelize.sync();
    // Insert sample data
    await insertSamplePermissions();
    await insertOffices();
    await insertSampleEmployees();
    await insertCustomers();
    console.log('Demo data created successfully.');
  } catch (error) {
    console.error('Error creating demo data:', error);
  } finally {
    setTimeout(() => {
      sequelize.close();
    }, 1000);
  }
})();

module.exports = {
  insertSamplePermissions,
  insertSampleEmployees,
  insertOffices,
  insertCustomers,
};