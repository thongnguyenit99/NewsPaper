const express = require('express');
const accountModles = require('../models/_account.model.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const moment = require('moment');
const saltRounds = 12;
const restrict = require("../middlewares/auth.mdw");
var datetime = new Date();

//login fb,gg, gh
require('../middlewares/login_fb_gb_gg.mdw')(router);
//regot password
require('../middlewares/forgotpass.mdw')(router);
//profile, account_vip
require('../middlewares/profile.mdw')(router);
//writer
require('../middlewares/advantage/writer/writer.mdw')(router);
require('../middlewares/advantage/editor/editor.mdw')(router);

//sign up
router.get('/register', function (req, res) {
  res.render('vwAccount/register');
})
router.post('/register', async function (req, res) {
  var data={
    email: req.body.email, username: req.body.username,
    DOB: moment(req.body.dob, 'DD-MM-YYYY').format('YYYY/MM/DD'),
    password: bcrypt.hashSync(req.body.password, saltRounds), r_ID: 1,
    premium: 0, cre_Date: datetime.toISOString().slice(0,10)
  }
  await accountModles.addNewAccount(data);
  const user = await accountModles.singleByUserName(req.body.username);
  req.session.isAuthenticated = true;
  req.session.authUser = user[0];
  res.redirect('/');
})
router.get('/register/is-available', async function (req, res) {
  const user = await accountModles.singleByUserName(req.query.user);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    return res.json(true);
  }

  res.json(false);
})
router.get('/register/is-available-email', async function (req, res) {
  const user = await accountModles.singleByEmail(req.query.email);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    return res.json(true);
  }

  res.json(false);
})

// sign in
router.get('/login', function (req, res) {
  if ( typeof req.cookies['username'] !== 'undefined'){
      res.render('vwAccount/login', {username: req.cookies['username'], password:req.cookies['password']});
 }else{
    res.render('vwAccount/login', {username:"", password:""});
  }
})

router.post('/login',async function (req, res) {
  if(req.body.rememberpass){
    res.cookie('username', req.body.username);
    res.cookie('password', req.body.password);
  }

  var user = await accountModles.singleByUserName(req.body.username);
  if(user.length > 0){
    req.session.isAuthenticated = true;
    req.session.authUser = user[0];
  }
  const url = req.query.retUrl || '/'
  if(url == "http://localhost:3000/account/login?retUrl=/account/logout"){
    url="/";
  }
  res.redirect(url);
})

router.get('/login/is-available_login', async function (req, res) {
  var user = await accountModles.singleByUserName(req.query.user);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    if(user[0].password != "" && user[0].password != null){
      if(bcrypt.compareSync(req.query.password, user[0].password)){
        return res.json(true);
      }
      else{
        return res.json(false);
      }
    }
  }
  res.json(false);
})

router.post('/logout', restrict, async function (req, res) {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
})

router.get('/advantage', restrict,function(req, res){
  if(req.session.authUser.r_ID == 2){
    return res.redirect('/account/advantage/2');
  }
  if(req.session.authUser.r_ID == 3){
    return res.redirect('/account/advantage/3');
  }

  res.redirect('/');
});


module.exports = router;