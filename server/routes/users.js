
const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

const auth = require('../middlewares/auth');

router.post('/signup', userController.users_create);
router.post('/login', userController.users_login);

// routes need authorization
router.post('/users', auth, userController.users_list);

module.exports = router;
