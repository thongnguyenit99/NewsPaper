const express = require('express');
const articleModel = require('../models/article.model');
const catModel = require('../models/category.model');
const comModel = require('../models/comment.model');
const acc_roleModel = require('../models/account_role.model');
const accountModel = require('../models/_account.model.js');
const tagModel = require('../models/tag.model');
const restrict = require("../middlewares/auth.mdw");
const puppeteer = require('puppeteer');
const moment = require('moment');
const router = express.Router();
const fs = require('fs');
const download = require('download');
var path = require('path');
//create tao file pdf
router.get('/generatepdf', async function(req, res) {
    var row = await articleModel.getarticlebyID(req.query.id);
    row[0].public_date = moment(row[0].public_date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var img = "<img src= '/article" + `${row[0].images}' style="margin-bottom:10px; width:auto" alt="anh dai dien" >`;
    //console.log(img);
    const HTMLContent =
        `<h2>${row[0].title}</h2> ` +
        `<div>Ngày đăng: ${row[0].public_date}</div>` +
        img +
        `${row[0].content}`;
    await page.setContent(HTMLContent);
    await page.pdf({ path: `public/pdf/${req.query.id}.pdf`, format: 'A4', printBackground: true });

    await browser.close();

    //res.json(false);
});
// download pdf
router.get('/download',  function(req, res) {
    const id = req.query.id;
    var file = path.join(__dirname);
    file = file.split('\\');
    i = 0;
    var path_file = "";
    while (i < file.length - 1) {
        path_file += file[i] + "\\";
        i++;
    }
    path_file += `public\\pdf\\${id}.pdf`;
    console.log(path_file);
    res.download(path_file, `${id}.pdf`);
})


// get list article
router.get('/danh-sach-bai-viet', async(req, res) => {
    const list = await articleModel.all();
    res.render('vwArticle/list', {
        layout: 'main.hbs',
        list,
        helpers: {
            format_DOB: function(date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY,h:mm:ss');
            },
            splitTitle: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[0];
                }
            },
            splitTitle1: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[1];
                }
            },
            splitTitle2: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[2];
                }
            }
        },

    });
})

router.get('/:c_alias/:id/:title', async function(req, res) {
    var isnopre = true;
    const today = moment().format('YYYY-MM-DD'); // lấy ngày hiện tại
    var isAbleToView;
    var subscriberName = null;
    const title = req.params.title;
    const nameChildCat = req.params.c_alias;
    const id = req.params.id;
    var user = req.session.authUser;
    var articleEntity;

    // bỏ vào đây chạy song song
    const [list, list5Art_same, opinion, category] = await Promise.all([
        articleModel.detailByTitle(title),
        articleModel.ArtSameCat(nameChildCat),
        comModel.getByArticle(title),
        articleModel.getNameCategorybya_ID(id)
        // comModel.getId_article(id),

    ]);
    if (list.length > 0 && list[0].isPremium != null) {
        // nếu ko phải là bài viết premium
        if (list[0].isPremium == 0) {
            isnopre = true;
        } else { // bai premium
            if (req.session.authUser) {
                if (req.session.authUser.premium == 1) {
                    var row = await accountModel.singleByUserName(req.session.authUser.username);
                    date_create_pre = new Date(`${row[0].date_create_premium}`);
                    var datenow = new Date(Date.now());
                    diffTime = (datenow - date_create_pre) / 1000; //giay
                    if (diffTime > 0) {
                        if (diffTime > row[0].time_premium) {
                            var entity = {
                                premium: 0,
                                date_create_premium: null,
                                time_premium: 0,
                            };
                            await accountModel.patch_account(entity, { username: req.session.authUser.username });
                            req.session.authUser.premium = 0;
                            req.session.authUser.date_create_premium = null;
                            req.session.authUser.time_premium = 0;
                            isnopre = false;
                        }
                    } else {
                        isnopre = false;
                    }
                } else {
                    isnopre = false;
                }
            } else {
                isnopre = false;
            }
        }
    }
    //console.log((isnopre));
    if (req.session.authUser) {
        r_id = req.session.authUser.r_ID;
    } else {
        r_id = 0;
    }
    res.render('vwArticle/details', {
        r_id,
        id,
        isnopre,
        list,
        premium: list[0].isPremium,
        list5Art_same,
        opinion,
        cat: category[0],
        // get,
        helpers: {
            format_DOB: function(date) {
                return moment(date, 'YYYY/MM/DD').format('h:mm | DD-MM-YYYY');
            },
            splitTitle: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[0];
                }
            },
            splitTitle1: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[1];
                }
            },
            splitTitle2: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[2];
                }
            }
        }
    });
})

router.get('/is-available_comment', async function(req, res) {
    var obj = {
        readerName: req.query.readerName,
        ID_Account: req.session.authUser.ID,
        ID_Article: req.query.id,
        Content: req.query.Content,
        created_at: moment().format('YYYY-MM-DD')
    }
    var result = await comModel.insertComment(obj);
    if (result) {
        return res.json(true);
    }
    res.json(false);
})

module.exports = router;