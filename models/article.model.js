const db = require('../utils/db');

const TBL_article = 'article'
module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_article}`);
    },
    // 10 newest article
    newest: function () {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID where isActive=1 order by public_date DESC limit 10`);
    },
    // 3-4 best featured article in the weekend
    bestnew: function () {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID where isActive=1 order by featured limit 10`);
    },
    // 10 the viewest  article
    viewest: function () {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID where isActive=1 order by views DESC limit 10`)
    }

}