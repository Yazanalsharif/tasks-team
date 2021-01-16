const jwt = require('jsonwebtoken');



const auth = async (req, res, next) => {
    const token = req.cookies.token;
    try{
        if(!token) {
            req.id = undefined;
            return next();
        }

        const decrypt = jwt.verify(token, process.env.JWTSECRT);
        req.id = decrypt.id;
        next();
    }catch(err){
        return res.status(500).send(err)
    }
}

module.exports = auth;
