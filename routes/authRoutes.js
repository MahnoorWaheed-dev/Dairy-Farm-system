const express = require('express');
const router = express.Router();
const { getLogin, postLogin, getLogout } = require('../controllers/authController');

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', getLogout);

module.exports = router;