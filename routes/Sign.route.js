const express = require('express');

const router = express.Router();
router.use(express.urlencoded())


router.get('/login', function (req, res) {
  res.render('vwAccount/login');
})
module.exports = router;