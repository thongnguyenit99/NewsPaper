const express = require('express');
const articleModel = require('../models/article.model');
const moment = require('moment');
const config = require('../config/config.json');
const router = express.Router();

router.get('/lien-he', (req, res) => {
    res.render('about');
})

router.get('/', async function(req, res) {
    const newlist = await articleModel.newest();
    const bestlist1 = await articleModel.bestnew1();
    const bestlist2 = await articleModel.bestnew2();
    const bestlist3 = await articleModel.bestnew3();
    const viewestlist = await articleModel.viewest();
    const top10_chungkhoan = await articleModel.top10_chungkhoan();
    const top10_doanhnghiep = await articleModel.top10_doanhnghiep();
    const top10_taichinh = await articleModel.top10_taichinh();
    const top10_kienthucdautu = await articleModel.top10_kienthucdautu();
    res.render('home', {
        newlist,
        bestlist1,
        bestlist2,
        bestlist3,
        viewestlist,
        top10_chungkhoan,
        top10_doanhnghiep,
        top10_taichinh,
        top10_kienthucdautu,
        helpers: {
            format_DOB: function(date) {
                //console.log(moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY'));
                return moment(date, 'YYYY/MM/DD').format('h:mm | DD-MM-YYYY');
            }
        }
    })

})

router.get('/article/search', async function (req, res) {
  var key = req.query.key;
  var k = key.split('-').join(' ');
  var listnor = [];
  var page = +req.query.page || 1;
  if (page < 0) page = 1;
  var offset = (page - 1) * config.pagination.limit;
  var listpre = await articleModel.pageByCatPre(k, config.pagination.limit, offset);
  var total = await articleModel.countByCat(k);
  if(listpre.length < 4) {
    var countpre = await articleModel.countByCatpre(k);
    if(offset - countpre < 0){
      offset = 0;
    }else{
      offset = offset - countpre;
    }
    listnor = await articleModel.pageByCat(k, config.pagination.limit - listpre.length, offset);
  }
  // tính số trang
  const nPages = Math.ceil(total / config.pagination.limit);
  const page_items = [];
  // duyệt số trang và  tính
  for (let i = 1; i <= nPages; i++) {
      const item = {
          value: i,
          isActive: i === page
      }
      page_items.push(item);
  }  
  var list = listpre.concat(listnor);
  res.render('vwArticle/search', {
    list,
    key: k,
    page_items,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages,
    helpers: {
      format_DOB: function (date) {
        return moment(date, 'YYYY/MM/DD').format('h:mm | DD-MM-YYYY');
      },
      getkey: function(){
          return k;
      },
      getpage: function(){
        return page;
    },
      splitTitle: function (tag) {
        for (var i = 0; i < tag.length; i++) {
          var t = tag.split(';');
                    return t[0];
        }
            },
            splitTitle1: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[1];
                }
            },
            splitTitle2: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[2];
                }
            }
        }
    });
    //res.render('vwArticle/search');
    //res.render('404');
})
module.exports = router;