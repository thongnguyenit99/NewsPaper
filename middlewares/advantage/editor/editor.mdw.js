const express = require('express');
const router = express.Router();
const restrict = require("../../auth.mdw");
const articleModel = require('../../../models/article.model');
const config = require('../../../config/config.json');
const moment = require('moment');
const { response } = require('express');
const accountModles = require('../../../models/_account.model');
module.exports = function(router) {

    router.get('/advantage/3', restrict, function(req, res) {
        if (req.session.authUser.r_ID == 3) {
            return res.render('vwAccount/vwAdvantage/editor/home', {
                layout: 'mainEditor.hbs',
                title:'Trang Chủ Biên Tập Viên',
                helpers: {
                    check_pemission: function(value) {
                        if (value == req.session.authUser.tc_ID) {
                            return true;
                        }
                        return false;
                    }
                }
            });
        } else {
            res.redirect('/');
        }
    });

    // load danh sách bài viết nháp
    router.get('/advantage/3/category/:c_id', restrict, async function(req, res) {

        const page = +req.query.page || 1;
        if (page < 0) page = 1;
        const offset = (page - 1) * config.pagination.limit;

        const [listdraft, total] = await Promise.all([
            articleModel.alldraft(req.params.c_id, config.pagination.limit, offset),
            articleModel.demListDraft(req.params.c_id)
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

        //const listdraft = await articleModel.alldraft(req.params.c_id);
        res.render('vwAccount/vwAdvantage/editor/listdraft', {
            title: 'Danh Sách Bài Chưa Duyệt',
            listdraft,
            page_items,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages,
            helpers: {
                format_DOB: function(date) {
                    return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
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
                },
                check_pemission: function(value) {
                    if (value == req.session.authUser.tc_ID) {
                        return true;
                    }
                    return false;
                },
                check_status: function(value) {
                    if (value == 3) {
                        return "Bị từ chối.";
                    }
                    if (value == 4) {
                        return "Chưa được duyệt.";
                    }
                    return "No status";
                }
            },
            layout: 'mainEditor.hbs'
        })
    });

    // load bài nháp để xét duyệt
    router.get('/advantage/3/category/:c_ID/:id', restrict, async function(req, res) {
        const _draft = await articleModel.draft(req.params.id);
        var category = await accountModles.getCategory();
        const c_ID = req.params.c_ID || "";
        const rows = await articleModel.single(req.params.id);
        const articledraft = rows[0];
        articledraft.public_date = moment(articledraft.public_date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
        category.forEach(function(value) {
            if (value.ID == articledraft.c_ID) {
                value.selected = true;
            } else {
                value.selected = false;
            }
        });
        res.render('vwAccount/vwAdvantage/editor/draft', {
            title: _draft[0].title ,
            _draft,
            category,
            articledraft,
            helpers: {
                format_DOB: function(date) {
                    return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
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
                },
                check_pemission: function(value) {
                    if (value == req.session.authUser.tc_ID) {
                        return true;
                    }
                    return false;
                }
            },
            layout: 'mainEditor.hbs'
        })
    });
    router.post('/advantage/3/category/:c_ID/:id', async function(req, res) {
        id = req.body.id;
        delete req.body.id;
        req.body.e_id = req.session.authUser.ID;
        if (req.body.tag) {
            req.body.note = null;
            req.body.public_date = moment(req.body.public_date, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        } else {
            delete req.body.public_date
        }
        await articleModel.update(req.body, { id: id });
        res.redirect(`/account/advantage/3/category/${req.body.c_ID}`);
    });

    // chờ xuất bản
    router.get('/advantage/3/watingforpublic', restrict, async function(req, res) {
        var temp = req.query.value || 1;
        if(temp == 1){
            var rows = await articleModel.getArticletrue(req.session.authUser.ID);
        }else if(temp ==2){
            var rows = await articleModel.getArticleByStatusC_IDandPulic_date_Flase(req.session.authUser.ID);
        }else{
            var rows = await articleModel.getArticleByStatusC_IDandPulic_date(req.session.authUser.ID);
        }
        
        var today = moment.utc(new Date(), 'YYYY-MM-DD[T]HH:mm[Z]');
        //datetime hien tai
        var datenow = new Date(Date.now());
        rows.forEach(function(value) {
            var public_date = moment.utc(value.public_date, 'YYYY-MM-DD[T]HH:mm[Z]');
            value.public_date = moment(value.public_date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
            if(temp == 3){
                value.duocxb = true;
            }
            if(temp == 2){
                value.duocxb = false;
            }else{
                value.duocxb = today.isAfter(public_date);   
            }
        });
        res.render('vwAccount/vwAdvantage/editor/waitpublic', {
            title:'Danh Sách Chờ Xuất Bản',
            rows,
            layout: 'mainEditor.hbs',
            helpers: {
                check_pemission: function(value) {
                    if (value == req.session.authUser.tc_ID) {
                        return true;
                    }
                    return false;
                }
            }
        });
    });
    router.post('/advantage/3/watingforpublic', restrict, async function(req, res) {
        id = req.body.id;
        delete req.body.id;
        if (req.body.featured) {
            req.body.featured = 1;
        } else {
            req.body.featured = 0;
        }
        if (req.body.isPremium) {
            req.body.isPremium = 1;
        } else {
            req.body.isPremium = 0;
        }
        req.body.note = "";
        req.body.sts_id = 2;
        req.body.isActive = 1;
        await articleModel.update(req.body, { id: id });
        await articleModel.addNewTagArticle({ id_tag: 1, id_article: id });
        res.redirect(req.headers.referer);
    });
    // tu chối 
    router.get('/advantage/3/refuse', restrict, async function(req, res) {
        var rows = await articleModel.getallaricledefusebyeditor(req.session.authUser.ID);
        res.render('vwAccount/vwAdvantage/editor/refuse', {
            title: 'Danh Sách Từ Chối Duyệt',
            rows,
            layout: 'mainEditor.hbs',
            helpers: {
                check_pemission: function(value) {
                    if (value == req.session.authUser.tc_ID) {
                        return true;
                    }
                    return false;
                }
            }
        });
    });

    router.get('/advantage/3/is-available', async function(req, res) {
        const user = await articleModel.getbytitlealias(req.query.alias);
        //console.log(user);
        if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
            return res.json(false);
        }

        res.json(true);
    })
}