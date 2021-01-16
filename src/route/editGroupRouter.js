const express = require('express');
const taskGroupEditController = require('../controllers/groupEdit.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/mytasks/:id/edit', auth, taskGroupEditController.getGroupEditPage);

router.post('/mytasks/:id/edit/adduser', auth, taskGroupEditController.addUserToGroup);

router.post('/mytasks/:id/edit/deleteUser', auth, taskGroupEditController.deleteUserFromGroup);


router.post('/mytasks/:id/edit/updateName', auth, taskGroupEditController.updateName);
module.exports = router;
