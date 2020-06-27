const db = require('../utils/db');

const TBL_cat = "categories"
module.exports = {
    all: function () {
        return db.load(`SELECT * FROM ${TBL_cat } c JOIN type_catelgories tc on tc.ID=c.tc_ID`);
    },
    getall: function() {
            return db.load(`SELECT * FROM ${TBL_cat} `);
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
    },
    // lấy dữ liệu và phân trang theo dữ liệu
    pageByCat: function (alias, limit, offset) {
        return db.load(`select * from ${TBL_cat}  c join  article a on c.ID=a.c_ID where  tc_alias = '${alias}' limit ${limit} offset ${offset}`);
    },
    countByCat: async function (alias) {
        const rows = await db.load(`select count(*) as total from ${TBL_cat} c join  article a on c.ID=a.c_ID where tc_alias = '${alias}'`);
        return rows[0].total;
    },
    pageByChild: function (alias, c_alias, limit, offset) {
        return db.load(`select * from ${TBL_cat}  c join  article a on c.ID=a.c_ID where  tc_alias = '${alias}' and c_alias = '${c_alias}' limit ${limit} offset ${offset}`);
    },
    countByChild: async function (alias, c_alias) {
        const rows = await db.load(`select count(*) as total from ${TBL_cat} c join  article a on c.ID=a.c_ID where tc_alias = '${alias}' and c_alias = '${c_alias}'`);
        return rows[0].total;
    }

}