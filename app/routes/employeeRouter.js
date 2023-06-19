const express = require('express');
const employeeController = require('../controllers/employeeController');
const verifyToken = require('../middleware/verifyToken');
const verifyPerm = require('../middleware/verifyAuthorize');
const { validateSchema } = require('../validation/validation');
const employeeSchema = require('../validation/employeeValid');
// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/employees')
  .get(verifyToken, verifyPerm('employees', 'read'), employeeController.getEmployees)
  .post(verifyToken, verifyPerm('employees', 'create'),
    (req, res, next) => {
      validateSchema(req, res, next, employeeSchema.POST);
    },
    employeeController.createEmployee,
  );

router.route('/employees/:id')
  .get(verifyToken, verifyPerm('employees', 'read'), employeeController.getEmployeeById)
  .put(verifyToken, verifyPerm('employees', 'update'),
    (req, res, next) => {
      validateSchema(req, res, next, employeeSchema.PUT);
    },
    employeeController.updateEmployeeById,
  )
  .delete(verifyToken, verifyPerm('employees', 'delete'), employeeController.deleteEmployee);

module.exports = router;
