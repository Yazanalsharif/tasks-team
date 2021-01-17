const express = require('express');
const jwt = require('jsonwebtoken');
const userModule = require('../modules/usersModule');
const flash = require('flash');

const router = express.Router();

const getLogin =  async (req, res) => {
    try {
        if(req.id) {
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


module.exports = {getLogin, postLogin};


