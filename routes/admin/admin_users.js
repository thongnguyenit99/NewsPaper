const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const restrictadmin = require("../../middlewares/restrictadmin.mdw");
const moment = require('moment');
var fs = require('fs');
const mkdirp = require('mkdirp');
const adminusermodel = require("../../models/adminusers.model");
const router = express.Router();
const validUrl = require('valid-url');


router.get('/', restrict, restrictadmin, async (req, res) => {
    var choose = req.query.value || "all";
    if(choose == "all"){
       var rows = await adminusermodel.getallaccount();
    }else{
        var rows = await adminusermodel.getbyroleaccount(choose);
    }
    rows.forEach(function(value){
        value.cre_Date = moment(value.cre_Date, 'YYYY/MM/DD').format('DD-MM-YYYY');
        if(value.Image == "" || value.Image == null){
            value.Image = "default-avatar-male.png";
        }
        if(value.premium == true){
            value.premium = true;
        }else{
            value.premium = false;
        }
        if (validUrl.isUri(value.Image)){
            value.url = true;
        } 
        else {
            path_img = value.Image;
            value.url = false;
        }
    });
    res.render('vwAccount/vwAdvantage/admin/user/list', { layout: 'mainAdmin.hbs', rows });
});

//detail
router.get('/detail', restrict, restrictadmin, async (req, res) => {
    var id = req.query.id;
    row = await adminusermodel.getaccountbyID(id);
    row.forEach(function(value){
        value.DOB = moment(value.DOB, 'YYYY/MM/DD').format('DD-MM-YYYY');
        value.cre_Date = moment(value.cre_Date, 'YYYY/MM/DD').format('DD-MM-YYYY');
        if(value.date_create_premium !="0000-00-00 00:00:00"){
           value.date_create_premium = moment(value.date_create_premium, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        }else{
            value.date_create_premium="";
        }
        if(value.Image == "" || value.Image == null){
            value.Image = "default-avatar-male.png";
        }
        if(value.premium == true){
            value.premium = true;
        }else{
            value.premium = false;
        }
        if (validUrl.isUri(value.Image)){
            value.url = true;
        } 
        else {
            path_img = value.Image;
            value.url = false;
        }
        });
       if(row[0].time_premium ==  null){
            row[0].time_premium = 0;
       }
    res.render("vwAccount/vwAdvantage/admin/user/detail", { layout: 'mainAdmin.hbs', row : row[0]});
})

//xoa
router.post('/', restrict, restrictadmin, async (req, res) => {
    if(req.body.id != ""){
        await adminusermodel.delaccount({ID: req.body.id});
    }
    res.redirect(req.headers.referer);
});
module.exports = router;