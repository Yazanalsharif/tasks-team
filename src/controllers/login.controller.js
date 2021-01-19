const jwt = require('jsonwebtoken');
const userModule = require('../modules/usersModule');


const getLogin =  async (req, res) => {
    try {
        if(req.user) {
            return res.redirect('/');
        }


        res.render('login.ejs', {
            error:req.flash('loginErr')[0],
            user:undefined
        });
    }catch(error) {
        res.status(500).send({error: 'Server error please call the author'})
    }
}

const postLogin = async (req, res) => {
    try{
        const user = await userModule.findUser(req.body);
        const token =  jwt.sign({id: user.id}, process.env.JWTSECRT);

        res.cookie('token', token, {
            secure:false, // make it true when you work with https
            httpOnly: true
        });

        res.redirect('/');
    }catch(err) {
        console.log(err);
        req.flash('loginErr', err);
        res.redirect('/login');
    }
}

const logout = async (req, res) => {
    try {
        if (!req.user) {
            throw new Error('you are not auth');
        }
        res.clearCookie('token');
        res.redirect('/');
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = {getLogin, postLogin, logout};


