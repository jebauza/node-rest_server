const express = require('express');
const fs = require('fs');
const path = require('path');

const { verifyTokenURL } = require('../middlewares/auth')
const app = express();

app.get('/files/:type/:fileName', verifyTokenURL, (req, res) => {
    let type = req.params.type;
    let fileName = req.params.fileName;
    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);

    if (!fs.existsSync(pathFile)) {
        pathFile = path.resolve(__dirname, `../assets/no-image.jpg`);
    }

    res.sendFile(pathFile);
});




module.exports = app;