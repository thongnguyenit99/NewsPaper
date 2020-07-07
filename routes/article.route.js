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
router.get('/danh-sach-bai-viet', async (req, res) => {
    const list = await articleModel.all();
    res.render('vwArticle/list', {
        layout: 'main.hbs',
        list,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY,h:mm:ss');
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
        },

    });
})

router.get('/:c_alias/:id/:title', async function (req, res) {
    var isnopre = true;
    const today = moment().format('YYYY-MM-DD'); // lấy ngày hiện tại
    var isAbleToView;
    var subscriberName = null;
    const title = req.params.title;
    const nameChildCat = req.params.c_alias;
    const id = req.params.id;
    var user = req.session.authUser;
    var articleEntity ;
    
    // bỏ vào đây chạy song song
    const [list, list5Art_same, opinion] = await Promise.all([
        articleModel.detailByTitle(title),
        articleModel.ArtSameCat(nameChildCat),
        comModel.getByArticle(title),
       // comModel.getId_article(id),
        
    ]);
    if(list.length > 0 && list[0].isPremium != null){
        if(list[0].isPremium  == 0){
            isnopre = true;
        }else{// 1
            if(req.session.authUser){
                if(req.session.authUser.premium == 1){
                    var row = await accountModel.singleByUserName(req.session.authUser.username);
                    date_create_pre = new Date(`${row[0].date_create_premium}`);
                    var datenow = new Date(Date.now());
                    diffTime = (Math.abs(datenow - date_create_pre))/1000;//giay
                    if(diffTime > row[0].time_premium){
                        isnopre = false;
                        var entity = {
                            premium: 0,
                            date_create_premium: null,
                            time_premium: 0,
                        };
                        await accountModel.patch_account(entity, {username: req.session.authUser.username});
                        req.session.authUser.premium = 0;
                        req.session.authUser.date_create_premium = null;
                        req.session.authUser.time_premium = 0;
                    }
                }
                else{
                    isnopre = false;
                }
            }else{
                isnopre = false;
            }
        }
    }
    //console.log((isnopre));
    if(req.session.authUser){
        r_id = req.session.authUser.r_ID;
    }else{
        r_id = 0;
    }
    res.render('vwArticle/details', {
        r_id,
        id,
        isnopre,
        list,
        list5Art_same,
        opinion,
       // get,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('h:mm | DD-MM-YYYY');
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
/*
router.post('/:c_alias/:id/:title',restrict ,async (req, res) => {
    const title = req.params.title;
    const nameChildCat = req.params.c_alias;
    const id = req.params.id;
    const today = moment().format('YYYY-MM-DD'); // lấy ngày hiện tại
 
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
    }


});*/
router.get('/is-available_comment', async function (req, res) {
    var obj = {
        readerName: req.query.readerName,
        ID_Account: req.session.authUser.ID,
        ID_Article: req.query.id,
        Content: req.query.Content,
        created_at: moment().format('YYYY-MM-DD')
    }
    var result = await comModel.insertComment(obj);
    if(result){
        return res.json(true);
    }
    res.json(false);
  })

module.exports = router;