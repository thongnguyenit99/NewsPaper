const config = require('../config/config.json');
const mysql = require('mysql');

let pool = mysql.createPool(config.mysql);

module.exports = {
    load: function (sql) {
        return new Promise((reslove, reject) => {
            pool.query(sql, (error, results) => {
                error && reject(error);
                results && reslove(results);
            })
        })
    },
    update: function (sql, entity, condition) {
        return new Promise((reslove, reject) => {
            pool.query(sql, [entity, condition], (error, results) => {
                error && reject(error);
                results && reslove(results);
            })
        })
    },
    insert: function (sql, entity) {
        return new Promise((reslove, reject) => {
            pool.query(sql, entity, (error, results) => {
                error && reject(error);
                results && reslove(results);
            })
        })
    }
    ,
    del: function (sql, condition) {
        return new Promise(function (resolve, reject) {
            pool.query(sql, condition, function (error, results) {
                if (error) {
                    return reject(error);
                }

                resolve(results);
            });
        });
    }

}