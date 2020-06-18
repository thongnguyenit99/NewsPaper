const express = require('express');
const accountModles = require('../models/_account.modle.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 12;
const someOtherPlaintextPassword = 'not_bacon';

//sign up
router.get('/register', function (req, res) {
  res.render('vwAccount/register');
})
router.post('/register', async function (req, res) {
  var datetime = new Date();
  var data={
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    r_ID: 1,
    premium: 0,
    cre_Date: datetime.toISOString().slice(0,10)
  }
  await accountModles.addNewAccount(data);
  res.render('Home' , {account:1, username:req.session.authUser[0].username,});
})
router.get('/is-available', async function (req, res) {
  const user = await accountModles.singleByUserName(req.query.user);
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
router.get('/profile', async function (req, res) {
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
    req.session.authUser = user;
  }
  res.redirect('/');
})

router.get('/is-available_login', async function (req, res) {
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

module.exports = router;