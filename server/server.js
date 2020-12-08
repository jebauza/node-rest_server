require('./config/config')

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/users', function(req, res) {
    res.json('Get user');
});

app.post('/users', function(req, res) {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            menssage: 'The name is requiered'
        });
    } else {
        res.json({
            person: body
        });
    }
});

app.put('/users/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    });
});

app.delete('/users', function(req, res) {
    res.json('Delete user');
});

app.listen(process.env.PORT, () => {
    console.log('Listening to port: ', process.env.PORT);
});