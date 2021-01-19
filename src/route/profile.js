const express = require('express');
const profileController = require('../controllers/profile.controller.js');
const auth = require('../middleware/auth');
const router = express.Router();


//display data for user email password the date that create the account
router.get('/profile', auth, profileController.getProfile);


module.exports = router;