const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const loginController = require('../controllers/login.controller');

router.get('/login', auth, loginController.getLogin);


router.post('/login', loginController.postLogin);

// transfer the req, res to logincontroller
router.get('/logout', auth, loginController.logout);

module.exports = router; 