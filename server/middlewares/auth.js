const jwt = require('jsonwebtoken');


// ================================
// Verify Token
// ================================
let verifyToken = (req, res, next) => {

    let access_token = req.get('access_token');

    jwt.verify(access_token, process.env.APP_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid access token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

module.exports = {
    verifyToken
}