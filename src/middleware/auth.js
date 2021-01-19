const jwt = require('jsonwebtoken');
const userModule = require('../modules/usersModule');


const auth = async (req, res, next) => {
    const token = req.cookies.token;
    try{
        if(!token) {
            req.id = undefined;
            return next();
        }

        const decrypt = jwt.verify(token, process.env.JWTSECRT);
        const user = await userModule.findUserById(decrypt.id);
        req.user = user;
        next();
    }catch(err){
        return res.status(500).send(err)
    }
}

module.exports = auth;
