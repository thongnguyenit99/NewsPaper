const express = require('express');
const catModel = require('../models/category.model');
const moment = require('moment');

const router = express.Router();

// get article byCat
router.get('/:Id', async function (req, res) {

    const listArticle = await catModel.single(req.params.Id);
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
router.get('/:tc_id/:Id', async function (req, res) {

    const listArticle = await catModel.loadByChild(req.params.tc_id, req.params.Id);
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