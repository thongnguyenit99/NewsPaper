const express = require('express');
const accountModles = require('../models/account.modle.js');
const router = express.Router();


router.get('/register', function (req, res) {
  res.render('vwAccount/register');
})
router.post('/register', function (req, res) {
  res.send('ok');
})
router.get('/is-available', async function (req, res) {
  console.log(req.query.user)
  const user = await accountModles.singleByUserName(req.query.user);
  console.log(user)
  if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
    res.json(true);
  }

  res.json(false);
})
module.exports = router;