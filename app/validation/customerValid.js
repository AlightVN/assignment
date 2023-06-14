const Joi = require('joi');

// Quy tắc validate cho customers
const POST = Joi.object().keys({
  customerNumber: Joi.number().positive(),
  customerName: Joi.string().min(5).max(50).required(),
  contractLastName: Joi.string().min(3).max(50).required(),
  contractFirstName: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(8).max(20).required(),
  addressLine1: Joi.string().min(10).max(50).required(),
  addressLine2: Joi.string().min(10).max(50).allow(null),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).required(),
  postalCode: Joi.string().min(5).max(15).required(),
  country: Joi.string().min(2).max(50).required(),
  salesRepEmployeeNumber: Joi.number().positive().required(),
  creditLimit: Joi.number().precision(2).required(),
});
  // PUT
const PUT = Joi.object().keys({
  customerNumber: Joi.number().positive(),
  customerName: Joi.string().min(5).max(50),
  contactLastName: Joi.string().min(3).max(50),
  contactFirstName: Joi.string().min(3).max(50),
  phone: Joi.string().min(8).max(20),
  addressLine1: Joi.string().min(10).max(50),
  addressLine2: Joi.string().min(10).max(50).allow(null),
  city: Joi.string().min(2).max(50),
  state: Joi.string().min(2).max(50).allow(null),
  postalCode: Joi.string().min(5).max(15).allow(null),
  country: Joi.string().min(2).max(50),
  salesRepEmployeeNumber: Joi.number().positive().allow(null),
  creditLimit: Joi.number().precision(2).allow(null),
});
module.exports = {
  POST,
  PUT,
};
