const express = require('express');
const path  = require('path');
const accountModles = require('../models/_account.model.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const validUrl = require('valid-url');
const saltRounds = 12;
const restrict = require("../middlewares/auth.mdw");
const fs = require('fs');
const multer  = require('multer');
var path_img="";
var datetime = new Date();
var n = 60;
const storage = multer.diskStorage({
  destination: './Public/img/profile/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage }).single('Image');

module.exports = function (router) {
    //profile
    router.get('/profile', restrict, async function (req, res) {
        //kiểm tra tài khoản đã hết hạn
        var row = await accountModles.singleByUserName(req.session.authUser.username);
        var diffTime =0;
        if(row.length > 0){
            if(row[0].premium == 1){
                var date_create_pre = row[0].date_create_premium;
                date_create_pre = new Date(`${date_create_pre}`);
                var datenow = new Date(Date.now());
                diffTime = (Math.abs(datenow - date_create_pre))/1000;//giay
                if(diffTime > row[0].time_premium){// hết hạn thì phải cập nhật lại
                    var entity = {
                        premium: 0,
                        date_create_premium: null,
                        time_premium: 0,
                    };
                    await accountModles.patch_account(entity, {username: req.session.authUser.username});
                }
            }
             //lay du lieu
             var row = await accountModles.singleByUserName(req.session.authUser.username);
             row.forEach(function(value){
             if(value.premium == 0){
                value.vip = true;
                 value.typeaccount = "Tài khoản thường.";
             }
             else{
                value.vip = false;
                 value.typeaccount = "Tài khoản vip. Còn " + Math.ceil((row[0].time_premium- diffTime)/60) + " Phút.";
             }
             if(value.Image == "" || value.Image == null){
                 value.Image = "default-avatar-male.png";
             }
             if (validUrl.isUri(value.Image)){
                 value.url = true;
             } 
             else {
                 path_img = value.Image;
                 value.url = false;
             }
             });
       
             if(row.length > 0){
             res.render('vwAccount/profile', {
                 Email: row[0].Email, username: row[0].username, typeaccount: row[0].typeaccount,
                 Image: row[0].Image, url: row[0].url, vip: row[0].vip });
             }else{
             res.render('500');
             }
        }
        else{
            res.render('500');
        }
    })
    
    router.post('/profile', restrict, upload, async function(req, res){
        if(req.body.password == "" || req.body.password == null){
            delete req.body.password;
        }else{
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        }
        if(req.file){
        const data = {...req.body, Image: req.file.filename};
        await accountModles.patch_account(data, {Email: req.session.authUser.Email});
        //cập nhật ảnh mói thì xóa ảnh cũ, "" là link ảnh online ko quan tâm
        if(path_img !=""){
            if(path_img != "default-avatar-male.png"){// ko xóa ảnh mạc định
            fs.unlinkSync('Public/img/profile/'+ path_img);
            path_img=req.file.filename;
            }
        }
        }
        else{
        await accountModles.patch_account(req.body, {Email: req.session.authUser.Email});
        }
        var row = await accountModles.singleByUserName(req.body.username);
        if(row.length > 0){
            req.session.authUser = row[0];
        }
        res.redirect('/account/profile');
    });
    
    
    //check username moi sua đa ton tại
    router.get('/profile/is-available', async function (req, res) {
        if(req.query.user.toLowerCase() != req.session.req.session.authUser.username.toLowerCase()){
        const user = await accountModles.singleByUserName(req.query.user);
        if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
            return res.json(true);
        }
        }
        res.json(false);
    })
    
    //account vip
    router.get('/profile/vip', restrict, async function (req, res) {
            res.render('vwAccount/accountvip'); 
    })
    router.post('/profile/vip', restrict, async function (req, res) {
        var date_ob = new Date();
        var date = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var hours = date_ob.getHours();
        var minutes = date_ob.getMinutes();
        var seconds = date_ob.getSeconds();
        // prints date & time in YYYY-MM-DD HH:MM:SS format
        //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
        datetime_pre = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        var entity = {
            premium: 1,
            date_create_premium: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            time_premium: n,
        };
        await accountModles.patch_account(entity, {username: req.session.authUser.username});
        res.redirect('/account/profile');
    })
    //check tài khoản vip
    router.get('/profile/vip/is-available', async function (req, res) {
        const user = await accountModles.singleByUserName(req.session.authUser.username);
        if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
          if(user[0].premium == 0)
            return res.json(true);
        }
      
        res.json(false);
      })
}