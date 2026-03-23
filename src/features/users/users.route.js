const express = require('express');
const router = express.Router();
const userController = require('./users.controller');
const auth = require('../../middlewares/auth.middleware')

router.post('/register', userController.createUser);
//router.get('/', userController.getAllUser);
router.post('/login', userController.login);
router.get('/me', auth , userController.getMe);

module.exports = router;