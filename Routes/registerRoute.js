const express = require('express');

const routeController = require('../Controllers/routeController');
const authController = require('../Controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(routeController.renderRegister)
    .post(authController.signup);

module.exports = router;