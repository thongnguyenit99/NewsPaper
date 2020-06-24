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
// //5 bài viết ngẫu nhiên cùng chuyên mục
// router.get('/:id',async (req, res) => {
//     const list5Art_same = await articleModel.ArtSameCat(req.params.id);
//     res.render('vwArticle/details', {
//         list5Art_same,
//         helpers: {
//             format_DOB: function (date) {
//                 return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
//             }
//         }
//     });
// });

router.get('/details/:id/:Id', async function (req, res) {
    const list = await articleModel.detailById(req.params.Id);
    const list5Art_same = await articleModel.ArtSameCat(req.params.id);
    res.render('vwArticle/details', {
        list,
        list5Art_same,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            },
            splitTitle: function (tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                   
                    return t[0];
                }
            },
            splitTitle1: function (tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[1];
                }
            },
            splitTitle2: function (tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[2];
                }
            }
        }
    });
})

module.exports = router;