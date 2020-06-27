const db = require('../utils/db');

const TBL_tp_cat = 'type_catelgories';
module.exports = {
    getAll: () => {
        return db.load(`select * from ${TBL_tp_cat} `);
    }
}