const express = require('express');

// Middlewares
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

const bcrypt = require('bcrypt');
const _ = require('underscore');

let app = express();
let User = require('../models/user');

app.get('/users', verifyToken, (req, res) => {

    //Paginate
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 10);

    User.find({ state: "A" }, 'name email img role state google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: "A" }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                });
            });
        });
});

app.post('/users', [verifyToken, verifyAdminRole], (req, res) => {

    let body = req.body;

    let newUser = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img,
        role: body.role
    });

    newUser.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //userDB.password = null;
        res.status(201).json({
            ok: true,
            user: userDB
        });
    });

    /* if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            menssage: 'The name is requiered'
        });
    } else {
        res.json({
            person: body
        });
    } */
});

app.put('/users/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;
    let user = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    // delete body.password;
    // delete body.google;

    User.findByIdAndUpdate(id, user, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.delete('/users/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    User.findByIdAndUpdate(id, { state: 'I' }, { new: true }, (err, userRemove) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userRemove) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userRemove
        });
    });

    /* User.findByIdAndRemove(id, (err, userDelete) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDelete) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDelete
        });
    }); */
});

module.exports = app;