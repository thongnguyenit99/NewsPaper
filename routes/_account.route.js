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
router.post('/register', function (req, res) {
    
  var password = bcrypt.hashSync(req.body.password, saltRounds);
  var username = req.body.username;
  var email = req.body.email;
  console.log(req.body);
  res.send('ok');
})
router.get('/is-available', async function (req, res) {
  const user = await accountModles.singleByUserName(req.query.user);
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    res.json(true);
  }

  res.json(false);
})

// sign in
router.get('/login', function (req, res) {
    res.render('vwAccount/login');
  })

module.exports = router;