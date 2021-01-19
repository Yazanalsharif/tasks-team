const express = require('express');

const router = express.Router();

const notFoundController = require('../controllers/NotFound.controller');


router.get('*', notFoundController.notFound);

module.exports = router;