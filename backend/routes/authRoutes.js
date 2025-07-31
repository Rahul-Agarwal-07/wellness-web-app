const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

//Public Routes
router.post('/register', controller.signup);
router.post('/login', controller.login);

//Protected Routes
router.get('/profile',authMiddleware, controller.getProfile);

module.exports = router;