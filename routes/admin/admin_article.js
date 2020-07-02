const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const articleModel = require('../../models/article.model');
const tpCatModel = require('../../models/type_category.model');
const catModel = require('../../models/category.model');
const accountModles = require('../../models/_account.model')
const moment = require('moment');
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
const router = express.Router();


//hiện thị danh sách bài
router.get('/', restrict, async (req, res) => {
    var user = req.session.authUser;
    const list = await articleModel.all();
    user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ? res.render('vwAccount/vwAdvantage/admin/article/list', {
         list, layout: 'mainAdmin.hbs', helpers: {
              format_DOB: function (date) {
                   return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY')
              }
         }
    }) : res.render('403');
});
router.get('/add', restrict, function(req, res){

    res.render('vwAccount/vwAdvantage/admin/article/add', { layout: 'mainAdmin.hbs' });
});
//
router.post('/add',upload,async function(req, res){
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

        else{
            await accountModles.addNewArticle(data);
            res.redirect('/admin/article');
        }
    
});
module.exports = router;