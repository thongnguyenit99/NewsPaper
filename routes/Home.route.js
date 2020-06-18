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
  //console.log(1);
  //console.log(req.session.authUser);
  //const bestlist = await articleModel.BestSeller();
  //Đã đăng nhập
  if(req.session.authUser){
    res.render('home', {
      newlist,
      account: 1,
      username:req.session.authUser[0].username,
      helpers: {
        format_DOB: function (date) {
          return dob_date('dd-MM-yyyy', date)
        }
      }
    }); 
  }else{
    res.render('home', {
      newlist,
      helpers: {
        format_DOB: function (date) {
          return dob_date('dd-MM-yyyy', date)
        }
      }
    }); 
  }
})
module.exports = router;