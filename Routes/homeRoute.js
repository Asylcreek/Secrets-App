const express = require('express');

const routeController = require('../Controllers/routeController');

const router = express.Router();

router.route('/').get(routeController.renderHomePage);

router.route('/secrets').get(routeController.renderSecrets);

router.route('/logout').get(routeController.logout);

module.exports = router;