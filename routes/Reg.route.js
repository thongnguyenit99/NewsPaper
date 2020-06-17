const express = require('express');

const router = express.Router();
router.use(express.urlencoded())


router.get('/register', function (req, res) {
  res.render('vwAccount/register');
})
module.exports = router;