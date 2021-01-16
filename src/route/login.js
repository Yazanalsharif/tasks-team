const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const loginController = require('../controllers/login.controller');

router.get('/login', auth, loginController.getLogin);


// transfer the req, res to logincontroller
router.get('/logout', auth, async (req, res) => {
    try {
        if (!req.id) {
            throw new Error('you are not auth');
        }
        res.clearCookie('token');
        res.redirect('/');
    } catch (err) {
        res.status(400).send({ err });
    }
})

router.post('/login', loginController.postLogin)


module.exports = router; 