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
     user.r_ID === 4 && user !== 'undefined' && user !== null ? res.render('vwAccount/vwAdvantage/admin/home', { layout: 'mainAdmin.hbs' }):res.render('403');
     console.log(user);
});
router.get('/article', restrict, async (req, res) => {
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
router.get('/tag',restrict, (req, res) => {  var user = req.session.authUser;
     user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID!==null && user.r_ID!=="undefined" ? res.render('vwAccount/vwAdvantage/admin/tag/list', { layout: 'mainAdmin.hbs' }):res.render('home');
});
router.get('/categories', restrict,async (req, res) => {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
        
          const [typeCat, Cat] = await Promise.all([
               tpCatModel.getAll(),
               catModel.getall()]);
          res.render('vwAccount/vwAdvantage/admin/categories/list', { typeCat,Cat, layout: 'mainAdmin.hbs' })
     }
     else {
          res.render('403');
     }
});
router.get('/categories/add', restrict, async (req, res) => {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          res.render('vwAccount/vwAdvantage/admin/categories/add', { layout: 'mainAdmin.hbs' })
     }
     else {
          res.render('403');
     }
});
router.get('/categories/edit/:id', restrict, async (req, res) => {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          res.render('vwAccount/vwAdvantage/admin/categories/', { layout: 'mainAdmin.hbs' })
     }
     else {
          res.render('403');
     }
});


router.get('/user',restrict, (req, res) => {  var user = req.session.authUser;
     user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ? res.render('vwAccount/vwAdvantage/admin/user/list', { layout: 'mainAdmin.hbs' }) : res.render('403');
});


module.exports = router;