const express = require('express');
const auth = require('../middleware/auth');
const taskController = require('../controllers/task.controller');

const router = express.Router();



router.get('/mytasks', auth, taskController.getTaskPage);

router.post('/mytasks', auth, taskController.createTaskGroup);

router.get('/mytasks/:id', auth, taskController.getTaskGroup);

router.post('/mytasks/:id', auth, taskController.createNewTask);

module.exports = router;