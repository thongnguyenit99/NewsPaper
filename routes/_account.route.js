const express = require('express');
//const nodemailer = require("nodemailer");
const accountModles = require('../models/_account.model.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 12;
const someOtherPlaintextPassword = 'not_bacon';
const restrict = require("../middlewares/auth.mdw");
const _accountModel = require('../models/_account.model.js');
var datetime = new Date();
require('../middlewares/login_fb_gb_gg.mdw')(router);
require('../middlewares/forgotpass.mdw')(router);
//sign up
router.get('/register', function (req, res) {
  res.render('vwAccount/register');
})
router.post('/register', async function (req, res) {
  var data={
    email: req.body.email, username: req.body.username,
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
router.get('/profile', restrict, async function (req, res) {
  res.render('vwAccount/profile');
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
  res.redirect(url);
})

router.get('/login/is-available_login', async function (req, res) {
  var user = await accountModles.singleByUserName(req.query.user);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    if(bcrypt.compareSync(req.query.password, user[0].password)){
      //console.log(bcrypt.compareSync(req.query.password, user[0].password));
      return res.json(true);
    }
    else{
      return res.json(false);
    }
  }
  res.json(false);
})


router.post('/logout', restrict, async function (req, res) {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
})
/*
//forgot password
var isforgotpassword = false;
var otp="";
var username=""

router.get('/login/forgotpassword', async function (req, res) {
  if(otp == ""){
    res.render('vwAccount/forgotpassword');
  }else{
    res.redirect('/account/login/forgotpassword/otp');
  }
})
router.post('/login/forgotpassword', async function (req, res) {
  isforgotpassword = true;
  username= req.body.username;
  var rows = await accountModles.singleByUserName(req.body.username);
  otp = Math.floor(100000 + Math.random() * 900000);

  var transporter =  nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'tranhoangduy.911@gmail.com',
        pass: 'duy13051999'
    }
  });
  var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'tranhoangduy.911@gmail.com',
      to: rows[0].Email,
      subject: 'Xác Nhận Email Từ Sàn Chướng Khoán DK',
      text: 'Chạo bạn ' + username + ',',
      html: `<p>Chào Bạn <b>${username}</b>,</p>
              <p>Mã OTP xác nhận của bạn là: <b>${otp}</b></p>
             <p style="color: red;  font-style: italic;">Vui lòng không cung cấp mã OTP này cho ai khác. Xin cảm ơn </p>
              <div>Tạm biệt nhen ahihi</div>
              `
  }
  transporter.sendMail(mainOptions, function(err, info){
      if (err) {
          console.log(err);
      } else {
          console.log('Message sent: ' +  info.response);
      }
  });

  console.log(otp);
  res.redirect('/account/login/forgotpassword/otp');
})
router.get('/login/forgotpassword/otp', async function (req, res) {
  if(isforgotpassword){
    res.render('vwAccount/otp');
  }else{
    res.redirect('/account/login/forgotpassword');
  }
})
router.post('/login/forgotpassword/otp', async function (req, res) {
  res.redirect('/account/login/forgotpassword/newpassword');
})

router.get('/login/forgotpassword/newpassword', async function (req, res) {
  if(isforgotpassword){
    res.render('vwAccount/newpass');

  }else{
    res.redirect('/account/login/forgotpassword');
  }
})
router.post('/login/forgotpassword/newpassword', async function (req, res) {
  if(otp){
    var entity={
      password: bcrypt.hashSync(req.body.password, saltRounds)
    }
    await accountModles.patch_account(entity, {username: username})
    res.redirect('/account/login');
    isforgotpassword = false;
    otp="";
    username="";

  }else{
    res.redirect('/account/login/forgotpassword');
  }
})

// check username có tồn tại
router.get('/login/forgotpassword/is-available_forgotpass', async function (req, res) {
  var user = await accountModles.singleByUserName(req.query.user);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    return res.json(true);
  }

  res.json(false);
})
// check email tồn tại không
router.get('/login/forgotpassword/is-available_email', async function (req, res) {
  var user = await accountModles.singleByUserName(req.query.user);
  if (user[0].Email !="") {
    return res.json(true);
  }
  res.json(false);
})
// check OTP
router.get('/login/forgotpassword/is-available_otp', async function (req, res) {
  if (req.query.otp == otp) {
    return res.json(true);
  }
  res.json(false);
})
*/

module.exports = router;