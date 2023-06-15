const Joi = require('joi');
const logger = require('../database/winstonConfig');

// Quy tắc validate cho users/register
const userRegisterSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).max(100).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/).required(),
  employeeNumber: Joi.number().positive().required(),
});
// validateSchema
const validateSchema = (req, res, next, schema) => {
  const { error } = schema.validate(req.body);

  if (error) {
    logger.error({ message: `Error: ${ error.details[0].message}`, userName: 'registerFail' });
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
module.exports = {
  userRegisterSchema,
  validateSchema,
};
