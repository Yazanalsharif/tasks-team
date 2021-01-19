const express = require('express');
const auth = require('../middleware/auth');
const taskEditController = require('../controllers/taskEdit.controller');

const router = express.Router();

router.post('/mytasks/:id/editTasks', auth, taskEditController.updateTasks);

module.exports = router;