const db = require('../utils/db');

const TABLE_account="account"
module.exports = {
    singleByUserName: function (username) {
        return db.load(`select * from ${TABLE_account} where username= N'${username}'`);
    },
    singleByEmail: function (email) {
        return db.load(`select * from ${TABLE_account} where email='${email}'`);
    },
    addNewAccount: function (entity) {
        return db.insert(TABLE_account, entity);
    },
    patch_account: function (entity, condition) {
        return db.update(TABLE_account, entity, condition);
    },
    patch_article: function (entity, condition) {
        return db.update('article', entity, condition);
    },
    getCategorybytcID: function(id){
        return db.load(`SELECT * FROM categories WHERE tc_ID = ${id}`);
    },
    getCategory: function(){
        return db.load(`SELECT * FROM categories`);
    },
    getCategorybyID: function(id){
        return db.load(`SELECT * FROM categories where ID= ${id}`);
    },
    addNewArticle: function (entity) {
        return db.insert('article', entity);
    },
    GetDataArticleByWriteridAndStatus:function (statusid, writerid) {
        return db.load(`SELECT * FROM article art, article_status ats WHERE art.sts_id = ${statusid} and art.writerID = ${writerid} and art.sts_id=ats.asts_id`);
    },
    getArticle:function (id) {
        return db.load(`SELECT * FROM article WHERE id =${id}`);
    },
    getWrite:function(){
        return db.load(`SELECT * FROM account where r_ID=2`);
    },
    getpathimagecategotybyc_id:function(c_id){
        return db.load(`SELECT * FROM pathimagecategory where c_id = ${c_id}`);
    },
    getalltypecategory:function(){
        return db.load(`SELECT * FROM type_catelgories`);
    }

}