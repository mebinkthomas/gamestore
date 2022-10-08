const express = require('express');
const router = express.Router();
const { signup, login, logout, getLoggedInUserDetails } = require('../controllers/userController');
const { isLoggedIn, customRole } = require('../middlewares/userMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', isLoggedIn, logout);
router.get('/me', isLoggedIn, getLoggedInUserDetails);

module.exports = router