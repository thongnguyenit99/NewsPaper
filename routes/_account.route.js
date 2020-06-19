const express = require('express');
const accountModles = require('../models/_account.modle.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 12;
const someOtherPlaintextPassword = 'not_bacon';
const restrict = require("../middlewares/auth.mdw");
var isAuthenticated = false;
var authUser={}
var datetime = new Date();
//passport
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {done(null, user);});
passport.deserializeUser(function(user, done) { done(null, user);});

passport.use(new GoogleStrategy({
    clientID: "907057907553-nev6pa2mema1gimknv2j2u51g9d4j5oq.apps.googleusercontent.com",
    clientSecret: "l9yeOI3_sCF-AMoN1NBMX_dc",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    var row = await accountModles.singleByEmail(profile._json.email);
      if(row.length > 0){// da co trong db
        isAuthenticated = true;
        authUser = row[0];
      }else{// chua co trong db
        var data={
          email: profile._json.email, username: profile._json.name, r_ID: 1,
          premium: 0, cre_Date: datetime.toISOString().slice(0,10),
          Image: profile._json.picture
        }
        isAuthenticated = true;
        authUser = data;
        await accountModles.addNewAccount(data);
      }
      return done(null, profile);
  }
));
router.use(passport.initialize());

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
router.get('/is-available', async function (req, res) {
  const user = await accountModles.singleByUserName(req.query.user);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    return res.json(true);
  }

  res.json(false);
})
router.get('/is-available-email', async function (req, res) {
  const user = await accountModles.singleByEmail(req.query.email);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    return res.json(true);
  }

  res.json(false);
})
//đăng nhập sử dụng passport
//google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.isAuthenticated = isAuthenticated;
    req.session.authUser = authUser;
    res.redirect('/');
  }
);




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


router.post('/logout', restrict, async function (req, res) {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
})

module.exports = router;