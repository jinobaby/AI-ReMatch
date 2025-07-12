var JWT = require('jsonwebtoken')

var VerifyToken = (req, res, next) => {
    var Token = req.headers.authorization
    console.log(Token);


    if (Token) {
        JWT.verify(Token, process.env.SECRET_KEY, (error, user) => {
            if (error) {

                console.log("token verification failed", error.message);
                return res.status(401).json("Token not valid")

            } else {

                console.log("token verification success");
                next()

            }
        })
    } else {

        console.log('Token is missing');
        return res.status(401).json('token is missing')

    }
}

module.exports = VerifyToken    