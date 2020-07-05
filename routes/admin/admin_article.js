const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const articleModel = require('../../models/article.model');
const accountModles = require('../../models/_account.model')
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const validUrl = require('valid-url');
const moveFile = require('move-file');
const storage = multer.diskStorage({
    destination: './Public/temp/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
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
router.get('/add', restrict, function (req, res) {
    var user = req.session.authUser;
    user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ?
        res.render('vwAccount/vwAdvantage/admin/article/add', { layout: 'mainAdmin.hbs' }) : res.render('403');

});


router.post('/add', upload, restrict, async function (req, res) {

    const data = { ...req.body, images: req.file.filename };
    if (req.body.c_ID == 1) {
        await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Co Phieu Top Dau/${req.file.filename}`);
        data.images = `Chung Khoan/Co Phieu Top Dau/${req.file.filename}`;
    }
    if (req.body.c_ID == 2) {
        await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Xu Huong Nhan Dinh/${req.file.filename}`);
        data.images = `Chung Khoan/Xu Huong Nhan Dinh/${req.file.filename}`;
    }
    if (req.body.c_ID == 3) {
        await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Bat Dong San/${req.file.filename}`);
        data.images = `Doanh Nghiep/Bat Dong San/${req.file.filename}`;
    }
    if (req.body.c_ID == 4) {
        await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Doanh Nghiep Niem Yet/${req.file.filename}`);
        data.images = `Doanh Nghiep/Doanh Nghiep Niem Yet/${req.file.filename}`;
    }
    if (req.body.c_ID == 5) {
        await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Ngan Hang Dien Tu/${req.file.filename}`);
        data.images = `Tai Chinh/Ngan Hang Dien Tu/${req.file.filename}`;
    }
    if (req.body.c_ID == 6) {
        await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Thuong Mai Dien Tu/${req.file.filename}`);
        data.images = `Tai Chinh/Thuong Mai Dien Tu/${req.file.filename}`;
    }

    else {

        await accountModles.addNewArticle(data);
        var user = req.session.authUser;
        user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ?
            res.redirect('/admin/article') : res.render('403');
    }

});
// Hiển thị trang chi tiết bài báo admin
router.get('/details/:id',restrict, async function (req, res) {
    const detai = await articleModel.draft(req.params.id);
    var user = req.session.authUser;
    user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ?
        res.render('vwAccount/vwAdvantage/admin/article/details', {
            detai,
            layout: 'mainAdmin.hbs',
            helpers: {
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
                },
                check_status: function (value) {
                    if(value == detai[0].sts_id){
                        return true;
                    }
                        return false;
                }
            }
        }) : res.render('403');

});

// chỉnh sửa bài viết
router.get('/edit/:id',restrict, async function (req, res) {
    var category = await accountModles.getCategory();
    var articles = await accountModles.getArticle(req.params.id);

    category.forEach(function (value) {
        if (value.ID == articles[0].c_ID) {
            value.selected = true;
        }
        else {
            value.selected = false;
        }
    });
    var user = req.session.authUser;
    user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ?
        res.render('vwAccount/vwAdvantage/admin/article/edit', {
            layout: 'mainAdmin.hbs',
            category,
            row: articles[0]
        }) : res.render('403');

});
//Xóa bài viết
router.post('/:id/del',restrict,async function (req, res) {
    var user = req.session.authUser;
    if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
        await articleModel.delArticle(req.params.id);
        res.redirect('/admin/article');
    }
    else {
        res.render('403');
    }
   
});
//Duyệt thẳng
router.get('/details/:id/publish',restrict,async function(req,res){  
    var user = req.session.authUser;
    if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
        console.log(req.params.id);
        await articleModel.update({sts_id:2}, {id: req.params.id});
        res.redirect('/admin/article');
    }
    else {
        res.render('403');
    }
    
})
// cập nhật
router.post('/update', upload, async function (req, res) {
    var id_article = req.body.id;
    var url_imgs = 'public/article/' + req.body.url_img;
    var urlsplit = url_imgs.split('/');
    var temp = urlsplit[urlsplit.length - 2];
    url_img = urlsplit[urlsplit.length - 1];
    delete req.body.url_img;
    delete req.body.id_article;
    req.body.sts_id = 4;
    req.body.WriterID = req.session.authUser.ID;
    // nó đổi ảnh       
    if (req.file) {
        const data = { ...req.body, images: req.file.filename };
        if (req.body.c_ID == 1) {
            await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Co Phieu Top Dau/${req.file.filename}`);
            data.images = `Chung Khoan/Co Phieu Top Dau/${req.file.filename}`;
        }
        if (req.body.c_ID == 2) {
            await moveFile(`public/temp/${req.file.filename}`, `public/article/Chung Khoan/Xu Huong Nhan Dinh/${req.file.filename}`);
            data.images = `Chung Khoan/Xu Huong Nhan Dinh/${req.file.filename}`;
        }
        if (req.body.c_ID == 3) {
            await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Bat Dong San/${req.file.filename}`);
            data.images = `Doanh Nghiep/Bat Dong San/${req.file.filename}`;
        }
        if (req.body.c_ID == 4) {
            await moveFile(`public/temp/${req.file.filename}`, `public/article/Doanh Nghiep/Doanh Nghiep Niem Yet/${req.file.filename}`);
            data.images = `Doanh Nghiep/Doanh Nghiep Niem Yet/${req.file.filename}`;
        }
        if (req.body.c_ID == 5) {
            await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Ngan Hang Dien Tu/${req.file.filename}`);
            data.images = `Tai Chinh/Ngan Hang Dien Tu/${req.file.filename}`;
        }
        if (req.body.c_ID == 6) {
            await moveFile(`public/temp/${req.file.filename}`, `public/article/Tai Chinh/Thuong Mai Dien Tu/${req.file.filename}`);
            data.images = `Tai Chinh/Thuong Mai Dien Tu/${req.file.filename}`;
        }

        var tam = await accountModles.getArticle(id_article);
        await accountModles.patch_article(data, { id: id_article });
        fs.unlinkSync(`public/article/${tam[0].images}`);// xóa ảnh cũ
        res.redirect('/admin/article');

    } else {
        if (req.body.c_ID == 1 && temp != 'Co Phieu Top Dau') {
            await moveFile(url_imgs, `public/article/Chung Khoan/Co Phieu Top Dau/${url_img}`);
            req.body.images = `Chung Khoan/Co Phieu Top Dau/${url_img}`;
        }
        if (req.body.c_ID == 2 && temp != 'Xu Huong Nhan Dinh') {
            await moveFile(url_imgs, `public/article/Chung Khoan/Xu Huong Nhan Dinh/${url_img}`);
            req.body.images = `Chung Khoan/Xu Huong Nhan Dinh/${url_img}`;
        }
        if (req.body.c_ID == 3 && temp != 'Bat Dong San') {
            await moveFile(url_imgs, `public/article/Doanh Nghiep/Bat Dong San/${url_img}`);
            req.body.images = `Doanh Nghiep/Bat Dong San/${url_img}`;
        }
        if (req.body.c_ID == 4 && temp != 'Doanh Nghiep Niem Yet') {
            await moveFile(url_imgs, `public/article/Doanh Nghiep/Doanh Nghiep Niem Yet/${url_img}`);
            req.body.images = `Doanh Nghiep/Doanh Nghiep Niem Yet/${url_img}`;
        }
        if (req.body.c_ID == 5 && temp != 'Ngan Hang Dien Tu') {
            await moveFile(url_imgs, `public/article/Tai Chinh/Ngan Hang Dien Tu/${url_img}`);
            req.body.images = `Tai Chinh/Ngan Hang Dien Tu/${url_img}`;
        }
        if (req.body.c_ID == 6 && temp != 'Thuong Mai Dien Tu') {
            await moveFile(url_imgs, `public/article/Tai Chinh/Thuong Mai Dien Tu/${url_img}`);
            req.body.images = `Tai Chinh/Thuong Mai Dien Tu/${url_img}`;
        }
        if (id_article != "") {//
            var tam = await accountModles.getArticle(id_article);
            await accountModles.patch_article(req.body, { id: id_article });
            res.redirect('/admin/article');
        } else {
            res.render('500');
        }
    }
});
module.exports = router;