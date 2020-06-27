const express = require('express');
const router = express.Router();
const restrict = require("../../auth.mdw");
const articleModel = require('../../../models/article.model');
const config = require('../../../config/config.json');
const moment = require('moment');


module.exports = function (router) {

    router.get('/advantage/3', restrict, function (req, res) {
        const DemDraft = articleModel.demListDraft();
        if (req.session.authUser.r_ID == 3) {
            return res.render('vwAccount/vwAdvantage/editor/home', {DemDraft,layout: 'mainEditor.hbs' });
        } else {
            res.redirect('/');
        }
        console.log(DemDraft);
    });
    
    // load danh sách bài viết nháp
    router.get('/advantage/categori/:c_id', async function (req, res) {
        const listdraft = await articleModel.alldraft(req.params.c_id);
        res.render('vwAccount/vwAdvantage/editor/listdraft', {
            listdraft,
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
            },
            layout:'mainEditor.hbs'
        })
    });

    // load bài nháp để xét duyệt
    router.get('/advantage/categori/:c_ID/:id', async function (req, res) {
        const _draft = await articleModel.draft(req.params.id);
        const c_ID=req.params.c_ID;
        res.render('vwAccount/vwAdvantage/editor/draft', {
            _draft,
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
            },
            layout:'mainEditor.hbs'
        })
    });




}