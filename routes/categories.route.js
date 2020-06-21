const express = require('express');
const catModel = require('../models/category.model');
const moment = require('moment');
const config = require('../config/config.json');

const router = express.Router();

// get article byCat
router.get('/:alias', async function (req, res) {
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;
    const [listArticle, total] = await Promise.all([
        catModel.pageByCat(req.params.alias, config.pagination.limit, offset),
        catModel.countByCat(req.params.alias)
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

    res.render('vwArticle/byCat', {
        listArticle,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
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
        listArticle,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            }
        }
    });
})

// // get article byCat
// router.get('/categories/:Id', async function (req, res) {

//     const listArticle = await catModel.single(req.params.Id);
//     res.render('vwArticle/byCat', {
//         listArticle,
//         helpers: {
//             format_DOB: function (date) {
//                 return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
//             }
//         }
//     });
// })

module.exports = router;