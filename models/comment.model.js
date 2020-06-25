const db = require('../utils/db');

const TBL_comment = 'comment';
module.exports = {
    getAll: () => {
        return db.load(`select * from ${TBL_comment} `);
    },
    getByArticle: (id) => {
        return db.load(`select * from ${TBL_comment} where ID_Article=${id} `);
    },
    addComment: function (entity) {
        return db.insert(TBL_comment, entity);
    },


}