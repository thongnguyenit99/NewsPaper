const express = require('express');
const articleModel = require('../models/article.model');
const catModel = require('../models/category.model');
const moment = require('moment');
const router = express.Router();
// get list article
router.get('/list', async (req, res) => {
    const list = await articleModel.all();
    res.render('vwArticle/list', {
        layout: 'main.hbs',
        list,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            }
        }
    });
})

// get article byCat
router.get('/categories/:Id', async function (req, res) {

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

router.get('/details/:Id', async function (req, res) {
    const list = await articleModel.detailById(req.params.Id);
    res.render('vwArticle/details', {
        list,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            }
        }
    });
})

module.exports = router;