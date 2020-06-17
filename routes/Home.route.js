const express = require('express');

const router = express.Router();
router.get('/about.html',(req,res) => {
  res.render('about');
})

router.get('/contact.html',(req,res) => {
    res.render('contact');
  })

router.get('/', (req, res) => {
    res.render('home');
})
module.exports = router;