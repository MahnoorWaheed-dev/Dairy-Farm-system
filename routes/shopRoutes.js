const express = require('express');
const router = express.Router();
const { 
    getShops, 
    addShop, 
    editShop, 
    deleteShop, 
    collectRent, 
    viewReceipt ,
    getOtherIncome
} = require('../controllers/shopController');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, getShops);

router.post('/add', isAuth, addShop);
router.post('/edit/:id', isAuth, editShop);
router.post('/delete/:id', isAuth, deleteShop);

// Rent Collection & Receipt Routes
router.post('/collect-rent', isAuth, collectRent);
router.get('/receipt/:id', isAuth, viewReceipt);
router.get('/other-income', isAuth, getOtherIncome);
// Testing Route - Manual Trigger for Cron Logic


module.exports = router;