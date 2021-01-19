const userModule = require('../modules/usersModule');
const moment = require('moment');
const getProfile = async (req, res) => {
    try{
        if(!req.user) {
            return res.redirect('/');
        }

        const user = req.user;
        //here the process for using spacific format for time
        //get the numbericTime 
        const numbericTime = user.created_at.getTime();
        //format the numbericTime To human reader date
        const created_at = moment(numbericTime).format('LLL');
        res.render('profile', {
            user,
            created_at
        });
    } catch(err) {
        
        res.status(500).send({error: err.message});
    }
}

module.exports = {getProfile};