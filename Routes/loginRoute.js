const express = require('express');

const routeController = require('../Controllers/routeController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.route('/').get(routeController.renderLogin).post(authController.login);

module.exports = router;