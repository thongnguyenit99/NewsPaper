const db = require('../utils/db');

const TABLE_account="account"
module.exports = {
    singleByUserName: function (username) {
        return db.load(`select * from ${TABLE_account} where username='${username}'`);
    },
    addNewAccount: function (entity) {
        return db.insert(TABLE_account, entity);
      },
}