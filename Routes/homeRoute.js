const express = require('express');

const routeController = require('../Controllers/routeController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.route('/').get(routeController.renderHomePage);

router.route('/secrets').get(routeController.renderSecrets);

router.route('/logout').get(routeController.logout);

router.route('/auth/google').get(authController.googleLogin);

router
    .route('/auth/google/secrets')
    .get(authController.googleLogin, authController.googleLoginSuccess);

router.route('/auth/facebook').get(authController.facebookLogin);

router
    .route('/auth/facebook/secrets')
    .get(authController.facebookLogin, authController.facebookLoginSuccess);

router
    .route('/submit')
    .get(routeController.submit)
    .post(routeController.createSecret);

module.exports = router;