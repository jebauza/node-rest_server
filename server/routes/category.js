const express = require('express');

// Middlewares
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

let app = express();
let Category = require('../models/category');

// =============================
// List categories
// =============================
app.get('/categories', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categories
            });
        });
});

// =============================
// Show category
// =============================
app.get('/categories/:id', verifyToken, (req, res) => {
    let categoryId = req.params.id;

    Category.findById(categoryId).exec((err, categoryDB) => {
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

        return res.json({
            ok: true,
            category: categoryDB
        });
    });

});

// =============================
// Create category
// =============================
app.post('/categories', verifyToken, (req, res) => {
    let body = req.body;

    let newCategory = new Category({
        description: body.description,
        user: req.user._id
    });

    newCategory.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            category: categoryDB
        });
    });
});

// =============================
// Update category
// =============================
app.put('/categories/:id', verifyToken, (req, res) => {
    let categoryId = req.params.id;
    let body = req.body;

    let updateCategory = {
        description: body.description
    }

    Category.findByIdAndUpdate(categoryId, updateCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The category is not valid'
                }
            });
        }

        return res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// =============================
// Delete Category
// =============================
app.delete('/categories/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let categoryId = req.params.id;

    Category.findByIdAndRemove(categoryId, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The category is not valid'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Deleted Category'
        });
    });
});




module.exports = app;