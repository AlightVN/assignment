const express = require('express');
const userController = require('../controllers/userController');
const { userRegisterSchema, validateSchema } = require('../validation/validation');

// eslint-disable-next-line new-cap
const router = express.Router();
// router post
router.post('/register',
  (req, res, next) => {
    validateSchema(req, res, next, userRegisterSchema);
  },
  userController.register);

router.post('/login', userController.login);

module.exports = router;
