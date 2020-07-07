const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const restrictadmin = require("../../middlewares/restrictadmin.mdw");
const articleModel = require('../../models/article.model');
const accountModles = require('../../models/_account.model')
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const validUrl = require('valid-url');
const moveFile = require('move-file');
const { Console } = require('console');
const storage = multer.diskStorage({
    destination: './Public/temp/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage }).single('images');
const router = express.Router();


//hiện thị danh sách bài
router.get('/',restrict, restrictadmin, async (req, res) => {
    const list = await articleModel.getAll();
    //var x = list.find(article => article.sts_id === 4)
    res.render('vwAccount/vwAdvantage/admin/article/list', {
        list, layout: 'mainAdmin.hbs', helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY')
            },
            // check_status: function (value) {
            //     if(value == x.sts_id){
            //         return true;
            //     }
            //         return false;
            // }
        }
    })
});
router.get('/add',restrict, restrictadmin, function (req, res) {
    res.render('vwAccount/vwAdvantage/admin/article/add', { layout: 'mainAdmin.hbs' })

});


router.post('/add', restrictadmin, upload, async function (req, res) {
    const today = moment().format('YYYY-MM-DD'); // lấy ngày hiện tại
    sts_id = req.body.sts_id;
    const data = {
        ...req.body,
        images: req.file.filename,
        sts_id: 4,
        public_date: today

    };
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
        res.redirect('/admin/article');
    }

});
// Hiển thị trang chi tiết bài báo admin
router.get('/details/:id',restrict, restrictadmin, async function (req, res) {
    const detai = await articleModel.draft(req.params.id);
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
            }

        }
    })

});

// chỉnh sửa bài viết
router.get('/edit/:id',restrict, restrictadmin, async function (req, res) {
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
    res.render('vwAccount/vwAdvantage/admin/article/edit', {
        layout: 'mainAdmin.hbs',
        category,
        Tacgia,
        row: articles[0]
    })

});
//Xóa bài viết
router.get('/:id/del', restrict, restrictadmin, async function (req, res) {
    await articleModel.update({ isActive: 0 }, { id: req.params.id });
    res.redirect('/admin/article');

});
//Duyệt thẳng
router.post('/', restrictadmin, async function (req, res) {
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

})
// cập nhật
router.post('/edit/:id', upload, restrict, restrictadmin, async function (req, res) {
    var id_article = req.body.id;
    var url_imgs = 'public/article/' + req.body.url_img;
    var urlsplit = url_imgs.split('/');
    var temp = urlsplit[urlsplit.length - 2];
    url_img = urlsplit[urlsplit.length - 1];
    delete req.body.url_img;
    delete req.body.id_article;
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
        if (id_article != "") {
            var tam = await accountModles.getArticle(id_article);
            await accountModles.patch_article(req.body, { id: id_article });
            res.redirect('/admin/article');
        } else {
            res.render('500');
        }
    }
});

module.exports = router;