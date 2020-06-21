const express = require('express');
const accountModles = require('../models/_account.model');
const someOtherPlaintextPassword = 'not_bacon';
var isAuthenticated = false;
var authUser={}
var isfalse=false;
var datetime = new Date();
//passport
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {done(null, user);});
passport.deserializeUser(function(user, done) { done(null, user);});
//google
passport.use(new GoogleStrategy({
    clientID: "907057907553-nev6pa2mema1gimknv2j2u51g9d4j5oq.apps.googleusercontent.com",
    clientSecret: "l9yeOI3_sCF-AMoN1NBMX_dc",
    callbackURL: "http://localhost:3000/account/auth/google/callback"
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
// face book
passport.use(new FacebookStrategy({
  clientID: '767039100769642',
  clientSecret: '92c28d1d5ef0b7143984acce903c0f81',
  callbackURL: "http://localhost:3000/account/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
},
  async function (accessToken, refreshToken, profile, done) {
    //console.log(profile._json.last_name);
    //fb này ko có email
    if(typeof profile._json.email == 'undefined' ||  profile._json.email ==""){
      isfalse = true;
    }else{
      // kiểm tra xem email đã đang ký chưa(đang nhập fb thì cũng dùng lại email và username chỉ có điều là pass rỗng())
      //hack vô sao được pass word phải có 6 kí tự haha
      var row = await accountModles.singleByEmail(profile._json.email);
      if (row.length == 0) {// chưa có trong db
        var data = {
          username: profile._json.last_name + profile._json.first_name, r_ID: 1,
          Email: profile._json.email,
          premium: 0, cre_Date: datetime.toISOString().slice(0, 10),
        }
        await accountModles.addNewAccount(data);
        // thiết lập dữ liêu để tạo section
        isAuthenticated = true;
        authUser = data;
      } else {// email đã có
        isAuthenticated = true;
        authUser = row[0];
      }
    }
    

    done(null, profile);
  },
));
//github
passport.use(new GitHubStrategy({
  clientID: 'Iv1.59689c4f566135bc',
  clientSecret: 'd5966fdbf57bdd4fcd59e1520c2e76c97a0ace16',
  scope: 'user:email',
  callbackURL: "http://localhost:3000/account/auth/github/callback",
},
async function(accessToken, refreshToken, profile, cb, done) {
  // tai khoản đang nhập được nhưng không có email
  if(typeof cb.emails[0].value == 'undefined' ||  cb.emails[0].value =="" || cb.emails[0].value == null){
    isfalse = true;
  }else{// có email
    // kiểm tra xem đã tồn tại trong db
    var row = await accountModles.singleByEmail(cb.emails[0].value);
    if (row.length == 0) {// chưa có trong db
      var data = {
        username: cb.username, r_ID: 1,
        Email: cb.emails[0].value,
        Image: cb.photos[0].value,
        premium: 0, cre_Date: datetime.toISOString().slice(0, 10),
      }
      await accountModles.addNewAccount(data);
      // thiết lập dữ liêu để tạo section
      isAuthenticated = true;
      authUser = data;
    } else {// email đã có
      isAuthenticated = true;
      authUser = row[0];
    }
  }


  return done(null, profile);
}));

module.exports = function (router) {
    router.use(passport.initialize());
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
    //facebook
    router.get('/auth/facebook', passport.authenticate('facebook',  { scope: [ 'email' ]}));
    router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/account/login' }),
    function (req, res) {
        if(isfalse == true){// login thành công nhưng ko có email thì lỗi
        res.locals.islogin=true;
        res.redirect('/account/register');
        res.locals.islogin=false;
        isfalse = false;
        }else{
        req.session.isAuthenticated = isAuthenticated;
        req.session.authUser = authUser;
        res.redirect('/');
        }
    }
    );

    //github
    router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

    router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/account/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        if(isfalse == true){//
        res.locals.islogin=true;
        res.redirect('/account/register');
        res.locals.islogin=false;
        isfalse = false;
        }else{
        req.session.isAuthenticated = isAuthenticated;
        req.session.authUser = authUser;
        res.redirect('/');
        }
    
    });
}




