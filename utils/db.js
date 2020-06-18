const config = require('../config/config.json');
const mysql = require('mysql');

let pool = mysql.createPool(config.mysql);

module.exports = {
    load: function (sql) {
        return new Promise(function (resolve, reject) {
          pool.query(sql, function (error, results, fields) {
            if (error) {
              return reject(error);
            }
    
            resolve(results);
          });
        });
    },
    update: function (table, entity, condition) {
        return new Promise(function (resolve, reject) {
          const sql = `update ${table} set ? where ?`;
          pool.query(sql, [entity, condition], function (error, results) {
            if (error) {
              return reject(error);
            }
    
            resolve(results);
          });
        });
      },
    insert: function (table, entity) {
        return new Promise(function (resolve, reject) {
          const sql = `insert into ${table} set ?`;
          pool.query(sql, entity, function (error, results) {
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      },
    delete:function (table, condition) {
        return new Promise(function (resolve, reject) {
          const sql = `delete from ${table} where ?`;
          pool.query(sql, condition, function (error, results) {
            if (error) {
              return reject(error);
            }
    
            resolve(results);
          });
        })
    }
}