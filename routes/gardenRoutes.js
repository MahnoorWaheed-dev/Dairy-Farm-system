const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/gardenController');

router.get('/', gardenController.getGardens);
router.post('/add', gardenController.addGarden);
router.post('/lease', gardenController.assignLease);
router.post('/release/:id', gardenController.releaseLease);
router.post('/edit/:id', gardenController.editGarden);
router.post('/delete/:id', gardenController.deleteGarden);

// Main export statement check karein:
module.exports = router;