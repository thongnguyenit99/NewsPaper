const express = require('express');
const articleModel = require('../models/article.model');
const catModel = require('../models/category.model');
const comModel = require('../models/comment.model');
const acc_roleModel = require('../models/account_role.model');
const accountModel = require('../models/_account.model.js');
const tagModel = require('../models/tag.model');
const restrict = require("../middlewares/auth.mdw");


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

router.get('/:c_alias/:id/:title', async function (req, res) {
    const today = moment().format('YYYY-MM-DD'); // lấy ngày hiện tại

    var isAbleToView;
    var isSubscriberCanViewPremium = false;     // kiểm tra xem độc giả đã đăng nhập và còn hạn sử dụng
    var subscriberName = null;

    const title = req.params.title;
    const nameChildCat = req.params.c_alias;
    const id = req.params.id;
    var user = req.session.authUser;
    var articleEntity ;
     // nếu là độc giả 
    // if (user.r_ID === 1 && user !== undefined) {
    //     subscriberName = user.username;
    //     //và còn hạn thì
    //     if (moment().isBefore(user.date_create_premium)) {
    //         isSubscriberCanViewPremium = true;  // có thể xem bài viết premium

    //     }
    //  }
    console.log(user);
    

    // bỏ vào đây chạy song song
    const [list, list5Art_same, opinion, get] = await Promise.all([
        articleModel.detailByTitle(title),
        articleModel.ArtSameCat(nameChildCat),
        comModel.getByArticle(title),
        comModel.getId_article(id),
        
    ]);
    res.render('vwArticle/details', {
        list,
        list5Art_same,
        opinion,
        get,
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
router.post('/:c_alias/:id/:title',restrict ,async (req, res) => {
    const title = req.params.title;
    const nameChildCat = req.params.c_alias;
    const id = req.params.id;
    const today = moment().format('YYYY-MM-DD'); // lấy ngày hiện tại
    //var user = req.session.authUser;
    //console.log(user);

    // nếu tồn tại user đã đăng nhập và quyền là độc giả
    if (req.session.authUser.r_ID == 1) {
             var obj = {
            readerName: req.body.readerName,
            ID_Account: req.session.authUser.ID,
            ID_Article: id,
            Content: req.body.Content,
            created_at: today
        }
        // bỏ vào đây chạy song song
        const [add, list, list5Art_same, opinion,get] = await Promise.all([
            comModel.insertComment(obj),
            articleModel.detailByTitle(title),
            articleModel.ArtSameCat(nameChildCat),
            comModel.getByArticle(title),
            comModel.getId_article(id)
        ]);
        console.log(obj);
        res.render('vwArticle/details', {
            add, list, list5Art_same, opinion, get,
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
            }});
    }
    else {
        res.render('403');
        console.log('bạn phải đăng nhập đúng quyền');
    }


});

module.exports = router;