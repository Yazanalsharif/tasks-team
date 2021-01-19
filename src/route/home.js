const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const userModule = require('../modules/usersModule');

router.get("/", auth, async (req, res) => {
    try {

        res.render('home', {
            user: req.user
        });

    } catch(error) {
        res.status(500).send({error: error.message});
    }
});


module.exports = router;