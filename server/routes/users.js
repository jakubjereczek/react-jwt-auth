
const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

const auth = require('../middlewares/auth');

router.post('/signup', userController.users_create);
router.post('/login', userController.users_login);
router.post('/refresh_tokens', userController.users_refresh_token);

router.post('/users', auth, userController.users_list);

module.exports = router;
