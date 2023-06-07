const express = require('express');
const customerController = require('../controller/customerController');
const verifyToken = require('../middleware/verifyToken');
const verifyPerm = require('../middleware/verifyAuthorize');
const { validateSchema } = require('../validation/validation');
const customerSchema = require('../validation/customerValid');
// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/customers')
    .get(verifyToken, verifyPerm('customers', 'read'), customerController.getCustomers)
    .post(verifyToken, verifyPerm('customers', 'create'),
        (req, res, next) => {
          validateSchema(req, res, next, customerSchema.POST);
        },
        customerController.createCustomer,
    );

router.route('/customers/:id')
    .get(verifyToken, verifyPerm('customers', 'read'), customerController.getCustomerById)
    .put(verifyToken, verifyPerm('customers', 'update'),
        (req, res, next) => {
          validateSchema(req, res, next, customerSchema.PUT);
        },
        customerController.updateCustomerById,
    )
    .delete(verifyToken, verifyPerm('customers', 'delete'), customerController.deleteCustomer);

module.exports = router;
