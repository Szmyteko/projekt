const express = require('express');
const router = express.Router();
const vegetablesController = require('../controllers/vegetablesController');

router.get('/', vegetablesController.getAllVegetables);
router.post('/', vegetablesController.addVegetable);
router.delete('/:id', vegetablesController.deleteVegetable);
router.put('/:id', vegetablesController.updateVegetable);

module.exports = router;