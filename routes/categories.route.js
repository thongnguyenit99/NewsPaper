const express = require('express');
const catModel = require('../models/category.model');
const moment = require('moment');

const router = express.Router();

// get article byCat
router.get('/:alias', async function (req, res) {

    const listArticle = await catModel.loadByCat(req.params.alias);
    res.render('vwArticle/byCat', {
        listArticle,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            }
        }
    });
})
// get byChildCat
router.get('/:alias/:c_alias', async function (req, res) {

    const listArticle = await catModel.loadByChild(req.params.alias, req.params.c_alias);
    res.render('vwArticle/byChild', {
        listArticle,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            }
        }
    });
})

module.exports = router;