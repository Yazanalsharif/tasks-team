const express = require('express');
const profileController = require('../controllers/profile.controller.js');
const auth = require('../middleware/auth');
const router = express.Router();



router.get('/profile', auth, profileController.getProfile);


module.exports = router;