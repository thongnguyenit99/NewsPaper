const express = require('express');
const articleModel = require('../models/article.model');
const dob_date = require('date-format')

const router = express.Router();
router.get('/about.html',(req,res) => {
  res.render('about');
})

router.get('/contact.html',(req,res) => {
    res.render('contact');
  })

router.get('/', async function (req, res) {
  const newlist = await articleModel.newest();
  const bestlist1 = await articleModel.bestnew1();
  const bestlist2 = await articleModel.bestnew2();
  const bestlist3 = await articleModel.bestnew3();
  const viewestlist = await articleModel.viewest();
  const top10_chungkhoan = await articleModel.top10_chungkhoan();
  const top10_doanhnghiep = await articleModel.top10_doanhnghiep();
  const top10_taichinh = await articleModel.top10_taichinh();

  res.render('home', {
    newlist,
    bestlist1,
    bestlist2,
    bestlist3,
    viewestlist,
    top10_chungkhoan,
    top10_doanhnghiep,
    top10_taichinh,
    helpers: {
      format_DOB: function (date) {
        return dob_date('dd-MM-yyyy', date)
      }
    }
  })

})
module.exports = router;