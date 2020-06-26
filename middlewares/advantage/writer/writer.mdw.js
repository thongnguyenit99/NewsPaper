const express = require('express');
const accountModles = require('../../../models/_account.model');
const router = express.Router();
const moment = require('moment');
const restrict = require("../../auth.mdw");
const multer  = require('multer');
const path  = require('path');
const fs = require('fs');
const validUrl = require('valid-url');
const moveFile = require('move-file');
const storage = multer.diskStorage({
    destination: './Public/temp/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })
const upload = multer({ storage: storage }).single('images');

module.exports = function (router) {
//advantage    
    router.get('/advantage/2', restrict, async function(req, res){
        if(req.session.authUser.r_ID == 2){
            res.render('vwAccount/vwAdvantage/writer/home', {layout: false});
        }else{
            res.redirect('/');
        }
    });

    // đang bài
    router.get('/advantage/2/write', restrict, async function(req, res){
        var id = req.query.type;
        var rows = await accountModles.getCategorybyID(id);
        if(rows.length > 0){
        res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: false, rows});
        }
        else{
        res.render('500');
        }
    });
    router.post('/advantage/2/write', restrict, upload, async function(req, res){
        req.body.sts_id=4;
        req.body.WriterID = req.session.authUser.ID;        
        if(req.file){
            const data = {...req.body, images: req.file.filename};
            if(req.body.c_ID == 1){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Co Phieu Top Dau/${req.file.filename}`);
            }
            if(req.body.c_ID == 2){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Xu Huong Nhan Dinh/${req.file.filename}`);
            }
            if(req.body.c_ID == 3){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Bat Dong San/${req.file.filename}`);
            }
            if(req.body.c_ID == 4){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Doanh Nghiep Niem Yet/${req.file.filename}`);
            }
            if(req.body.c_ID == 5){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Ngan Hang Dien Tu/${req.file.filename}`);
            }
            if(req.body.c_ID == 6){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Thuong Mai Dien Tu/${req.file.filename}`);
            }
            await accountModles.addNewArticle(data);
            res.redirect(req.headers.referer);
        }else{
            res.render('500');
        }
    })

    // chi tiết bài báo
    router.get('/advantage/2/newspaper', restrict, async function(req, res){
        res.render('vwAccount/vwAdvantage/writer/newspaper', {layout: false});
    })
    router.get('/advantage/2/newspaper/tablenewspaper', restrict, async function(req, res){
        var statusid = req.query.type;
        var rows = await accountModles.GetDataArticleByWriteridAndStatus(statusid, req.session.authUser.ID);
        /*var today = new Date();
        var publicday = new Date(`${rows[0].public_date}`);
        var active_time = moment.utc(publicday, 'YYYY-MM-DD[T]HH:mm[Z]');
        var current_time = moment.utc(today, 'YYYY-MM-DD[T]HH:mm[Z]');
        if(rows.length > 0){
            console.log(active_time.format());
            console.log(current_time.format());
            console.log( active_time.isAfter(current_time));
        }*/
        // không có nút sửa
        if(statusid == 1 || statusid == 2){
            res.render('vwAccount/vwAdvantage/writer/tablenewspaper', {layout:false, rows,
                helpers: {
                    isedit: function (status_id){
                      if(status_id == 3 || status_id == 4){
                        return true;
                      }
                      return false;
                    }
                }
            });
        }else if(statusid == 3 || statusid == 4){ 
            res.render('vwAccount/vwAdvantage/writer/tablenewspaper', {layout:false, rows,
                helpers: {
                    isedit: function (status_id){
                      if(status_id == 3 || status_id == 4){
                        return true;
                      }
                      return false;
                    }
                }
            });
        }
        else{
            res.render('505');
        }
    })
    // view, edit
    router.get('/advantage/2/newspaper/tablenewspaper/detail', restrict, async function(req, res){
        id = req.query.id;
        isedit = req.query.isedit;
        if(isedit == 'true'){
            res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: false, id, isedit});
        }else{
            res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: false, id});
        }
    })
  
}