const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/gardenController');

router.get('/', gardenController.getGardens);
router.post('/add', gardenController.addGarden);
router.post('/lease', gardenController.assignLease);
router.post('/release/:id', gardenController.releaseLease);

// Main export statement check karein:
module.exports = router;