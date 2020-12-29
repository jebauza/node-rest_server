const jwt = require('jsonwebtoken');

const User = require('../models/user');

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

// ================================
// Verify AdminRole
// ================================
let verifyAdminRole = (req, res, next) => {

    if (!req.user) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'User not found'
            }
        });
    }

    User.findById(req.user._id, function(err, userDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Internal Server Error'
                }
            });
        }

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        req.user = userDB;

        if (userDB.role == 'ADMIN_ROLE') {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                err: {
                    message: 'The user is not an administrator'
                }
            });
        }
    });
};

// ================================
// Verify token URL
// ================================
let verifyTokenURL = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.APP_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};




module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyTokenURL
}