const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const User = require('../models/user');
const Product = require('../models/product');


// default options
app.use(fileUpload({
    useTempFiles: true
}));

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded'
                }
            });
    }

    let file = req.files.file;
    let fileExtension = file.name.lastIndexOf('.') > 0 ? file.name.substring(file.name.lastIndexOf('.')) : null;
    // Allowed Extensions
    let validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    if (!fileExtension || validExtensions.indexOf(fileExtension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Valid extensions are: ' + validExtensions.join(', '),
                    ext: fileExtension
                }
            });
    }

    // Valid Type
    let typeValid = ['products', 'users'];
    if (typeValid.indexOf(type) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'The allowed types are: ' + typeValid.join(', '),
                }
            });
    }

    // Change fileName
    let fileName = `${id}-${new Date().getMilliseconds()}` + fileExtension;

    switch (type) {
        case 'products':
            productUploadImg(file, id, res, fileName);
            break;

        case 'users':
            userUploadImg(file, id, res, fileName);
            break;
    }
});

function fileDelete(fileName, type) {
    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }
}

function userUploadImg(file, userId, res, fileName) {
    let folder = 'users';
    User.findById(userId, (err, userDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
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

        file.mv(path.resolve(__dirname, `../../uploads/${folder}/${fileName}`), (err) => {
            if (err) {
                fileDelete(fileName, folder);
                return res.status(500)
                    .json({
                        ok: false,
                        message: 'file.mv',
                        err
                    });
            }

            let oldImg = userDB.img;
            userDB.img = fileName
            userDB.save((err, userSave) => {
                if (err) {
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        });
                }

                fileDelete(oldImg, folder);

                res.json({
                    ok: true,
                    img: fileName,
                    user: userSave
                });
            });
        });
    });
}

function productUploadImg(file, productId, res, fileName) {
    let folder = 'products';
    Product.findById(productId, (err, productDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        file.mv(path.resolve(__dirname, `../../uploads/${folder}/${fileName}`), (err) => {
            if (err) {
                fileDelete(fileName, folder);
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            let oldImg = productDB.img;
            productDB.img = fileName
            productDB.save((err, productSave) => {
                if (err) {
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        });
                }

                fileDelete(oldImg, folder);

                res.json({
                    ok: true,
                    img: fileName,
                    product: productSave
                });
            });
        });
    });
}



module.exports = app;