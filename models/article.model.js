const db = require('../utils/db');

const TBL_article = 'article'
module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_article}`);
    },
    newest: function () {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID order by public_date DESC limit 10`);
    }

}