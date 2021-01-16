const express = require('express');
const flash = require('flash');
const auth = require('../middleware/auth');

const router = express.Router();
const signupController = require('../controllers/signup.controller');
router.get('/signup', auth, signupController.getSignPage);

router.post('/signup', signupController.registerUser)


module.exports = router;