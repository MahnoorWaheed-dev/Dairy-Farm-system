const express = require('express');
const router = express.Router();

// 1. Controller se saare functions ko import karein
const { 
    getLogin, 
    postLogin, 
    getLogout, 
    getForgotPassword, 
    postForgotPassword 
} = require('../controllers/authController');

// 2. Auth Routes
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', getLogout);

// 3. Forgot Password Routes
router.get('/forgot-password', getForgotPassword);
router.post('/forgot-password', postForgotPassword);

module.exports = router;