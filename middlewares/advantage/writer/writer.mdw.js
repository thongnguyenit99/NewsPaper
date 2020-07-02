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
        var category = await accountModles.getCategorybytcID(id);
        if(category.length > 0){
        res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: false, category});
        }
        else{
        res.render('500');
        }
    });
    router.post('/advantage/2/write', restrict, upload, async function(req, res){
        var id_article = req.body.id_article;
        var url_imgs = 'public/article/'+ req.body.url_img;
        var urlsplit = url_imgs.split('/');
        var temp = urlsplit[urlsplit.length -2];
        url_img = urlsplit[urlsplit.length -1];
        delete req.body.url_img;
        delete req.body.id_article;
        req.body.sts_id=4;
        req.body.WriterID = req.session.authUser.ID; 
        // nó đổi ảnh        
        if(req.file){
            const data = {...req.body, images: req.file.filename};
            if(req.body.c_ID == 1){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Co Phieu Top Dau/${req.file.filename}`);
                data.images = `Chung Khoan/Co Phieu Top Dau/${req.file.filename}`;
            }
            if(req.body.c_ID == 2){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Xu Huong Nhan Dinh/${req.file.filename}`);
                data.images = `Chung Khoan/Xu Huong Nhan Dinh/${req.file.filename}`;
            }
            if(req.body.c_ID == 3){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Bat Dong San/${req.file.filename}`);
                data.images = `Doanh Nghiep/Bat Dong San/${req.file.filename}`;
            }
            if(req.body.c_ID == 4){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Doanh Nghiep Niem Yet/${req.file.filename}`);
                data.images = `Doanh Nghiep/Doanh Nghiep Niem Yet/${req.file.filename}`;
            }
            if(req.body.c_ID == 5){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Ngan Hang Dien Tu/${req.file.filename}`);
                data.images = `Tai Chinh/Ngan Hang Dien Tu/${req.file.filename}`;
            }
            if(req.body.c_ID == 6){
                await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Thuong Mai Dien Tu/${req.file.filename}`);
                data.images = `Tai Chinh/Thuong Mai Dien Tu/${req.file.filename}`;
            }

            if(id_article == ""){//add chỗ này để phân biệt add với update
                await accountModles.addNewArticle(data);
                res.redirect(req.headers.referer);
            }
            else{//update 
                var tam = await accountModles.getArticle(id_article);
                await accountModles.patch_article(data, {id:id_article});
                fs.unlinkSync(`public/article/${tam[0].images}`);// xóa ảnh cũ 
                res.redirect(req.headers.referer);
            }
        }else{
            // đổi chuyển mục cay vl
            if(req.body.c_ID == 1 && temp != 'Co Phieu Top Dau'){
                await moveFile(url_imgs, `public/article/Chung Khoan/Co Phieu Top Dau/${url_img}`);
                req.body.images = `Chung Khoan/Co Phieu Top Dau/${url_img}`;
            }
            if(req.body.c_ID == 2 && temp != 'Xu Huong Nhan Dinh'){
                await moveFile(url_imgs, `public/article/Chung Khoan/Xu Huong Nhan Dinh/${url_img}`);
                req.body.images = `Chung Khoan/Xu Huong Nhan Dinh/${url_img}`;
            }
            if(req.body.c_ID == 3 && temp != 'Bat Dong San'){
                await moveFile(url_imgs, `public/article/Doanh Nghiep/Bat Dong San/${url_img}`);
                req.body.images = `Doanh Nghiep/Bat Dong San/${url_img}`;
            }
            if(req.body.c_ID == 4 && temp != 'Doanh Nghiep Niem Yet'){
                await moveFile(url_imgs, `public/article/Doanh Nghiep/Doanh Nghiep Niem Yet/${url_img}`);
                req.body.images = `Doanh Nghiep/Doanh Nghiep Niem Yet/${url_img}`;
            }
            if(req.body.c_ID == 5 && temp != 'Ngan Hang Dien Tu'){
                await moveFile(url_imgs, `public/article/Tai Chinh/Ngan Hang Dien Tu/${url_img}`);
                req.body.images = `Tai Chinh/Ngan Hang Dien Tu/${url_img}`;
            }
            if(req.body.c_ID == 6 && temp != 'Thuong Mai Dien Tu'){
                await moveFile(url_imgs, `public/article/Tai Chinh/Thuong Mai Dien Tu/${url_img}`);
                req.body.images = `Tai Chinh/Thuong Mai Dien Tu/${url_img}`;
            }
            if(id_article != ""){
                var tam = await accountModles.getArticle(id_article);
                await accountModles.patch_article(req.body, {id:id_article});
                res.redirect(req.headers.referer);
            }else{
                res.render('500');
            }
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
            res.render('vwAccount/vwAdvantage/writer/tablenewspaper', {layout:false, rows,statusid,
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
            res.render('vwAccount/vwAdvantage/writer/tablenewspaper', {layout:false, rows, statusid,
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
        var id = req.query.id;
        var isedit = req.query.isedit;
        var articles = await accountModles.getArticle(id);
        var category = await accountModles.getCategory();
        category.forEach(function(value){
            if(value.ID == articles[0].c_ID){
                value.selected = true;
            }
            else{
                value.selected = false;
            }
        });
        if(isedit == 'true'){
            res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: false, id, isedit,
                row: articles[0], category
            });
        }else{
            res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: false, id, 
                row: articles[0], category
            });
        }
    })
  
}