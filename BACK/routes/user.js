const express = require('express');
const router = express.Router();
userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/userInfos', auth, userController.userInfos);

module.exports = router;