const express = require('express');
const articleModel = require('../models/article.model');
const moment = require('moment');

const router = express.Router();
router.get('/lien-he',(req,res) => {
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
        //console.log(moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY'));
        return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
      }
    }
  })

})
router.post('/article/search', async function (req, res) {
  const key=req.body.key;
  var article_pre =[];
  const listSearch = await articleModel.allSearch(key)
  console.log(listSearch.length);
  var index = 0;
  var index_remove = [];
  while (index < listSearch.length){
     if(listSearch[index].sts_id != 2 && listSearch[index].sts_id != null){
        //listSearch.splice(index, 1);
        if(index_remove.includes(index) == false){
          index_remove.push(index);
        }
      }
      if(listSearch[index].isPremium	== 1){
        if(index_remove.includes(index) == false){
          index_remove.push(index);
        }
        article_pre.push(listSearch[index]);
        //listSearch.splice(index, 1);
      }
      index++;
  }
  index=0;
  while (index < index_remove.length){
    listSearch.splice(index, 1);
    index++;
  }
  const list = article_pre.concat(listSearch);
  console.log(list.length);
  res.render('vwArticle/search',{
    list,
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