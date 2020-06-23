const express = require('express');
const articleModel = require('../models/article.model');
const moment = require('moment');

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
        return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
      }
    }
  })

})

router.post('/article/search', async function (req, res) {
  const key=req.body.key;
  const listSearch = await articleModel.allSearch(key)
  res.render('vwArticle/search',{
    listSearch,
    helpers: {
      format_DOB: function (date) {
          return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
      },
      splitTitle: function (tag) {
        for (var i = 0; i < tag.length; i++) {
          var t = tag.split(';');

          return t[0];
        }
      },
      splitTitle1: function (tag) {
        for (var i = 0; i < tag.length; i++) {
          var t = tag.split(';');
          return t[1];
        }
      },
      splitTitle2: function (tag) {
        for (var i = 0; i < tag.length; i++) {
          var t = tag.split(';');
          return t[2];
        }
      }
  }
  });
})
module.exports = router;