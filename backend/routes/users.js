const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/usersController');


router.get('/', authMiddleware.verifyToken, userController.getAllUsers);


router.put('/:id/role', authMiddleware.verifyToken, userController.updateUserRole);

module.exports = router;
