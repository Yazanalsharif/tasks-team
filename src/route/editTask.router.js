const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const taskEditController = require('../controllers/taskEdit.controller');

router.post('/mytasks/:id/editTasks', auth, taskEditController.updateTasks);

module.exports = router;