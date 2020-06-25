const express = require('express');
const articleModel = require('../models/article.model');
const catModel = require('../models/category.model');
const comModel = require('../models/comment.model');
const acc_roleModel = require('../models/account_role.model');
const accountModel = require('../models/_account.model.js');

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

router.get('/:c_alias/:title', async function (req, res) {
    const today = moment().format('YYYY-MM-DD'); // lấy ngày hiện tại
       
    const title = req.params.title;
    const nameChildCat = req.params.c_alias;
   

    var user = await accountModel.singleByUserName(req.body.username);
    if (user.length > 0) {
        req.session.isAuthenticated = true;
        req.session.authUser = user[0];
    }
    
    const list = await articleModel.detailByTitle(title);
    const list5Art_same = await articleModel.ArtSameCat(nameChildCat);

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