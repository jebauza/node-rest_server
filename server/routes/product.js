const express = require('express');

// Middlewares
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

let app = express();
let Product = require('../models/product');
let Category = require('../models/category');


// =============================
// List products
// =============================
app.get('/products', verifyToken, (req, res) => {
    //Paginate
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 10);

    let searchs = {};
    req.body.name ? searchs.name = new RegExp(req.body.name, 'i') : '';
    req.body.unitPrice ? searchs.unitPrice = req.body.unitPrice : '';
    req.body.description ? searchs.description = new RegExp(req.body.description, 'i') : '';

    Product.find(searchs).skip(from).limit(limit)
        .sort('name')
        .populate('category')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Product.count(searchs, (err, count) => {
                return res.json({
                    ok: true,
                    products,
                    count
                });
            });
        });
});

// =============================
// Show product
// =============================
app.get('/products/:id', verifyToken, (req, res) => {
    let productId = req.params.id;

    Product.findById(productId)
        .populate('category')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
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

            return res.json({
                ok: true,
                product: productDB
            });
        });
});

// =============================
// Create product
// =============================
app.post('/products', verifyToken, (req, res) => {
    let body = req.body;

    let newProduct = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.categoryId,
        user: req.user._id
    });

    Category.findById(newProduct.category, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        newProduct.save((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.status(201).json({
                ok: true,
                product: productDB
            });
        });
    });
});

// =============================
// Update product
// =============================
app.put('/products/:id', verifyToken, (req, res) => {
    let productId = req.params.id;
    let body = req.body;

    let updateProduct = {
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.categoryId
    }

    Category.findById(updateProduct.category, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        Product.findByIdAndUpdate(productId, updateProduct, { new: true, runValidators: true }, (err, productDB) => {
            if (err) {
                return res.status(500).json({
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

            return res.json({
                ok: true,
                product: productDB
            });
        });
    });
});

// =============================
// Delete Product
// =============================
app.delete('/products/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let productId = req.params.id;

    Product.findById(productId, { avaliable: false }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
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

        productDB.avaliable = false;
        productDB.save((err, productDeleted) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                message: 'Product removed'
            });
        });
    });
});



module.exports = app;