const express = require('express');
const router = express.Router();
const staffIncomeController = require('../controllers/staffIncomeController');

router.get('/', staffIncomeController.getStaffIncomePage);
router.post('/add', staffIncomeController.addStaffIncome);
router.get('/delete/:id', staffIncomeController.deleteStaffIncome);

module.exports = router;