const Joi = require('joi');

// Quy tắc validate cho employees POST
const POST = Joi.object().keys({
  employeeNumber: Joi.number().positive(),
  lastName: Joi.string().min(3).max(50).required(),
  firstName: Joi.string().min(3).max(50).required(),
  extension: Joi.string().max(50).required(),
  email: Joi.string().email().min(10).max(100).required(),
  officeCode: Joi.string().max(10).required(),
  reportsTo: Joi.number().positive().allow(null),
  jobTitle: Joi.string().valid('president', 'manager', 'leader').required(),
});
  // PUT
const PUT = Joi.object().keys({
  employeeNumber: Joi.number().positive(),
  lastName: Joi.string().min(3).max(50),
  firstName: Joi.string().min(3).max(50),
  extension: Joi.string().max(50),
  email: Joi.string().email().min(10).max(100),
  officeCode: Joi.string().max(10),
  reportsTo: Joi.number().positive().allow(null),
  jobTitle: Joi.string().valid('president', 'manager', 'leader'),
});

module.exports = {
  POST,
  PUT,
};
