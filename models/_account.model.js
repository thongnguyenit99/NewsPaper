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
}