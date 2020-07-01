const express = require('express');
const tagModel = require('../models/tag.model');
const moment = require('moment');
const config = require('../config/config.json');

const router = express.Router();

// getbyTags
router.get('/:name', async function (req, res) {
    const name = req.params.name;

  // giẳ sử cho 2 bài viết có chung tags hiện lên 1 trang
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * 2;
    const [listArticle_tags, total] = await Promise.all([
        tagModel.getByName(name, 2, offset),
        tagModel.countByTags(name)
    ]);
   
    // tính số trang
    const nPages = Math.ceil(total / 2);
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
    res.render('vwArticle/byTag', {
        listArticle_tags,
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