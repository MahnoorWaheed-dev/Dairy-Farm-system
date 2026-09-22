const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET Financial Reports Page
router.get('/', reportController.getFinancialReport);

module.exports = router;