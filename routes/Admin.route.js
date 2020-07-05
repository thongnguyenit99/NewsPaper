const express = require('express');
const restrict = require("../middlewares/auth.mdw");
const articleModel = require('../models/article.model');
const tpCatModel = require('../models/type_category.model');
const catModel = require('../models/category.model');
const moment = require('moment');


const router = express.Router();
router.get('/', restrict, (req, res) => {
     var user = req.session.authUser;

     // console.log(list);
     user.r_ID === 4 && user !== 'undefined' && user !== null ? res.render('vwAccount/vwAdvantage/admin/home', { layout: 'mainAdmin.hbs' }) : res.render('403');
});

router.get('/tag', restrict, (req, res) => {
     var user = req.session.authUser;
     user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ? res.render('vwAccount/vwAdvantage/admin/tag/list', { layout: 'mainAdmin.hbs' }) : res.render('home');
});




// quản lý chuyên mục //

// hiện danh sách
router.get('/categories', restrict, async (req, res) => {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {

          const [typeCat, Cat] = await Promise.all([
               tpCatModel.getAll(),
               catModel.getall()]);

          res.render('vwAccount/vwAdvantage/admin/categories/list', { typeCat, Cat, layout: 'mainAdmin.hbs' })
     }
     else {
          res.render('403');
     }
});
// hiện trang thêm chuyên mục
router.get('/categories/add', restrict, async (req, res) => {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          const [typeCat, Cat] = await Promise.all([
               tpCatModel.getAll(),
               catModel.getall()]);
          res.render('vwAccount/vwAdvantage/admin/categories/add', { typeCat, Cat, layout: 'mainAdmin.hbs' })
     }
     else {
          res.render('403');
     }
});
// Hiển thị chyên mục con theo chuyên mục cha
router.get('/categories/:alias', restrict, async function (req, res) {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          for (const c of res.locals.lcCat) {
               if (c.tc_alias === +req.params.alias) {
                    c.isActive = true;
               }
          }
          const list = await catModel.getByCat(req.params.alias);
          res.render('vwAccount/vwAdvantage/admin/categories/byCat', {
               list,
               empty: list.length === 0,
               layout: 'mainAdmin.hbs'
          });
     }
     else {
          res.render('403');
     }

})
// chỉnh sửa chuyên mục theo id
router.get('/categories/edit/:id', restrict, async (req, res) => {
     var user = req.session.authUser;

     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          const id = +req.params.id || -1;
          const rows = await catModel.singleCat(id);
          if (rows.length === 0)
               return res.send('Invalid parameter.');
          const cats = rows[0];

          res.render('vwAccount/vwAdvantage/admin/categories/edit', {
               cats, layout: 'mainAdmin.hbs'
          })
     }
     else {
          res.render('403');
     }
});
// hiển thị trang chi tiết chuyên mục theo id
router.get('/categories/details/:conId', restrict, async function (req, res) {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          const list = await catModel.detailById(req.params.conId);
          res.render('vwAccount/vwAdvantage/admin/categories/details', {
               list,
               empty: list.length === 0,
               layout: 'mainAdmin.hbs',
          });
     }
     else {
          res.render('403');
     }

})
// xử lý thêm chuyên mục
router.post('/categories/add', restrict, async function (req, res) {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined")
     {
          c_Large = req.body.tc_ID
          if (c_Large == 1) {
               c_Large = 'Chứng Khoán'
          }
          else if (c_Large == 2) {
               c_Large = 'Doanh Nghiệp'
          }
          else {
               c_Large = 'Tài Chính'
          }
          var entity = {
               ...req.body,
               c_Large,

         }
               const addCat = await catModel.insertCat(entity);
               res.render('vwAccount/vwAdvantage/admin/categories/add', {
                    layout: 'mainAdmin.hbs', addCat
               })
               //console.log(addCat);
     }
     else {
          res.render('403');
     }

})
// xử lý xóa chuyên mục theo id
router.post('/categories/del', restrict, async function (req, res) {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          await catModel.delCat(req.body.ID);
          res.redirect('/admin/categories');
     }
     else {
          res.render('403');
     }

})
// xử lý cập nhật chuyên mục
router.post('/categories/update', restrict, async function (req, res) {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          if (req.body.c_Name == '' || req.body.c_alias == '' || req.body.c_Name == '' && req.body.c_alias == '') {

               if (req.body.c_Name == '')
               {
                    res.render('vwAccount/vwAdvantage/admin/categories/error-alert', {
                         layout: 'mainAdmin.hbs', err: 'Tên chuyên mục không được rỗng!Mời bạn nhập lại!!'
                    })
               }
               else if ( req.body.c_alias == '')
               {
                    res.render('vwAccount/vwAdvantage/admin/categories/error-alert', {
                         layout: 'mainAdmin.hbs',
                         err: 'Bí danh không được rỗng!!Mời bạn nhập lại!',
                         idCat:req.body.ID,
                    })
               }
          }
          else {

               await catModel.updateCat(req.body);
               console.log(req.body);
               res.redirect('/admin/categories');
          }
     }
     else {
          res.render('403');
     }
})

//quản lý user
router.get('/user', restrict, (req, res) => {
     var user = req.session.authUser;
     user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ? res.render('vwAccount/vwAdvantage/admin/user/list', { layout: 'mainAdmin.hbs' }) : res.render('403');
});


module.exports = router;