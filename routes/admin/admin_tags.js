const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const restrictadmin = require("../../middlewares/restrictadmin.mdw");
const articleModel = require('../../models/article.model');
const tagModel = require('../../models/tag.model');
const moment = require('moment');
var fs = require('fs');
const mkdirp = require('mkdirp');
const router = express.Router();

router.get('/', restrict, restrictadmin,async (req, res) => {
    const list = await tagModel.getAll();
    res.render('vwAccount/vwAdvantage/admin/tag/list', { list,layout: 'mainAdmin.hbs' })
});
router.post('/delTag', restrict, restrictadmin, async (req, res) => {
    if (req.body.ID != "") {
        await tagModel.delTag({ ID: req.body.ID });
    }
    res.redirect('/admin/tag');
});


module.exports = router;