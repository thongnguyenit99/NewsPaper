const express = require('express');
const catModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const moment = require('moment');
const config = require('../config/config.json');
const router = express.Router();

// get article byCat
router.get('/:alias', async function (req, res) {
    var listnor = [];
    var page = +req.query.page || 1;
    if (page < 0) page = 1;
    var offset = (page - 1) * config.pagination.limit;
    //console.log(offset);
    const [listpre, total] = await Promise.all([
        catModel.pageByCatPre(req.params.alias, config.pagination.limit, offset),
        catModel.countByCat(req.params.alias)
    ]);
    //console.log(listpre.length);
    if (listpre.length < 5) {
        var countpre = await catModel.countByCatPre(req.params.alias);
        if (offset - countpre < 0) {
            offset = 0;            
        } else {
            offset = offset - countpre;
        }
        listnor = await catModel.pageByCat(req.params.alias, config.pagination.limit-listpre.length, offset);
    }
    //console.log(listnor);
    // tính số trang
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    // duyệt số trang và  tính 
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }
    var list = listpre.concat(listnor);
    res.render('vwArticle/byCat', {
        title: 'Theo Loại Chuyên Mục',
        list,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            },
            splitTitle: function (tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    //console.log(t + '\n');
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
// get byChildCat
router.get('/:alias/:c_alias', async function (req, res) {

    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;
    const [listArticle, total] = await Promise.all([
        catModel.pageByChild(req.params.alias, req.params.c_alias, config.pagination.limit, offset),
        catModel.countByChild(req.params.alias, req.params.c_alias)
    ]);
    // tính số trang
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    // duyệt số trang và  tính 
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }

    // const listArticle = await catModel.loadByChild(req.params.alias, req.params.c_alias);
    res.render('vwArticle/byChild', {
        title: 'Theo Chuyên Mục',
        listArticle,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            },
            splitTitle: function (tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    //console.log(t + '\n');
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