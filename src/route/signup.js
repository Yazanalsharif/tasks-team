const express = require('express');
const auth = require('../middleware/auth');
const signupController = require('../controllers/signup.controller');


const router = express.Router();

router.get('/signup', auth, signupController.getSignPage);

router.post('/signup', signupController.registerUser)


module.exports = router;