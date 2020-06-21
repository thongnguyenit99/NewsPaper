const db = require('../utils/db');

const TBL_cat = "categories"
module.exports = {
    all: function () {
        return db.load(`SELECT * FROM ${TBL_cat } c JOIN type_catelgories tc on tc.ID=c.tc_ID`);
    },
    // load byId
    single: function (Id) {
        return db.load(`select * from ${TBL_cat} c join  article a on c.ID=a.c_ID where tc_ID = ${Id}`);
    },
    // load byAlias
    loadByChild: function (alias, c_alias) {
        return db.load(`select * from ${TBL_cat} c join  article a on c.ID=a.c_ID where tc_alias = '${alias}' and c_alias = '${c_alias}'`);
    },
    loadByCat: function (alias) {
        return db.load(`select * from ${TBL_cat} c join  article a on c.ID=a.c_ID where tc_alias = '${alias}'`);
    }

}