const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

router.get('/', personController.getPersonList);
router.post('/add', personController.addPerson);
router.post('/transaction', personController.addTransaction);
router.get('/statement/:id', personController.getPersonStatement);
// Express POST route for delete
router.post('/delete/:id', personController.deletePerson);

module.exports = router;