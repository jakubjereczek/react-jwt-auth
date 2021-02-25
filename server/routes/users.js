
const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.post('/signup', userController.users_create);
router.post('/login', userController.users_login);
router.post('/refresh_tokens', userController.users_refresh_token);

module.exports = router;
