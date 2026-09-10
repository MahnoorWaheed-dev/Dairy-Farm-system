const express = require('express');
const router = express.Router();
const { getGardens, addGarden, addGardenTransaction } = require('../controllers/gardenController');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, getGardens);
router.post('/add', isAuth, addGarden);
router.post('/transaction', isAuth, addGardenTransaction);

module.exports = router;