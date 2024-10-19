const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/last-sign-in', userController.updateLastSignIn);

module.exports = router;