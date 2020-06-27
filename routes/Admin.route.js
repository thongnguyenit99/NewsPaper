const express = require('express');
const restrict = require("../middlewares/auth.mdw");
const router = express.Router();
router.get('/', restrict, (req, res) => {
    var user = req.session.authUser;
    user.r_ID === 4 && user !== 'undefined' && user !== null ? res.render('vwAccount/vwAdvantage/admin/home', { layout: 'mainAdmin.hbs' }):res.render('home');
     console.log(user);
});
router.get('/article', (req, res) => {  var user = req.session.authUser;
    user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined" ? res.render('vwAccount/vwAdvantage/admin/article/list', { layout: 'mainAdmin.hbs' }):res.render('home');
});
router.get('/tag', (req, res) => {  var user = req.session.authUser;
     user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID!==null && user.r_ID!=="undefined" ? res.render('vwAccount/vwAdvantage/admin/tag/list', { layout: 'mainAdmin.hbs' }):res.render('home');
});
router.get('/categories', (req, res) => {  var user = req.session.authUser;
     user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID!==null && user.r_ID!=="undefined" ? res.render('vwAccount/vwAdvantage/admin/categories/list', { layout: 'mainAdmin.hbs' }):res.render('home');
});
router.get('/user', (req, res) => {  var user = req.session.authUser;
     user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID!==null && user.r_ID!=="undefined" ? res.render('vwAccount/vwAdvantage/admin/user/list', { layout: 'mainAdmin.hbs' }):res.render('home');
});


module.exports = router;