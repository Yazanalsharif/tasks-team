const validator = require('validator');
const usersModule = require('../modules/usersModule');

const getSignPage = (req, res) => {
    try {
        if(req.id) {
            return res.redirect('/');
        }
        res.render('signup', {
            user:undefined,
            error: req.flash('err')[0]
        });
    } catch (error) {
        res.status(500).send({ error: "server Error" });
    }
}



const registerUser = async (req, res, next) => {
    const data = req.body;

    try {
        //the user name must be greater than 3 letters
        if (validator.isEmpty(data.userName, { ignore_whitespace: true }) || data.userName.length < 3) {
            throw new Error('please Enter your Correct Name');
        }

        //ensure that the address is valid email
        if (!validator.isEmail(data.email)) {
            throw new Error('Invalid Email');
        }
        //password must contain letters, number and simpols 
        if (validator.isEmpty(data.password, { ignore_whitespace: true }) || validator.isAlphanumeric(data.password)) {
            throw new Error('the password must contain letter, number and Simpols');
        }
        
        if (validator.isEmpty(data.confirmPassword, { ignore_whitespace: true }) || data.password !== data.confirmPassword) {
            throw new Error('the passwords does\'t the same ');
        }



        //send the data that you want to register in database to usersModule
        const result = await usersModule.insertUser({
            username: data.userName,
            email: data.email,
            user_password: data.password
        });
        res.redirect('/login');
    } catch (error) {
        if (error.message) {
            req.flash('err', error.message);
        } else {
            req.flash('err', error);
        }


        res.redirect('/signup');
    }
}


module.exports = { registerUser, getSignPage };