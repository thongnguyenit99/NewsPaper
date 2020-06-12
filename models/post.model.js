const db = require('../utils/db');

const TABLE_post = 'posts'
module.exports = {
    all: function () {
        return db.load(`select * from ${TABLE_post}`);
    }
}