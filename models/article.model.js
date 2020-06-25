const db = require('../utils/db');

const TBL_article = 'article'
module.exports = {
    // get all article
    all: function () {
        return db.load(`select * from ${TBL_article} a join categories c where a.c_ID=c.ID`);
    },
    // 10 newest article
    newest: function () {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID where isActive=1 order by public_date DESC limit 10`);
    },
    // 3-4 best featured article:chứng khoán,doanh nghiệp,tài chính in the weekend
    // get 1 featured article
    bestnew1: function () {
        return db.load(`select c.c_alias,a.title_alias,a.public_date,a.c_ID ,a.id,a.title,a.abstract,a.author,DATEDIFF(CURDATE(), a.public_date) AS day,a.featured,a.views,a.isActive,a.images,c.ID,c.tc_ID,c.c_Name,c.c_Large 
        from article a join categories c on a.c_ID=c.ID
        where a.isActive=1 and a.featured=1 and a.c_ID=1 OR a.c_ID=2 having (day>0 and day<7) order by rand() LIMIT 1`);
    },
    bestnew2: function () {
        return db.load(`select c.c_alias,a.title_alias,a.public_date,a.c_ID , a.id,a.title,a.abstract,a.author,DATEDIFF(CURDATE(), a.public_date) AS day,a.featured,a.views,a.isActive,a.images,c.ID,c.tc_ID,c.c_Name,c.c_Large
         from article a join categories c on a.c_ID=c.ID where a.isActive=1 and a.featured=1  and a.c_ID=3 OR a.c_ID=4
         having (day>0 and day<7) order by rand() LIMIT 1`);
    },
    bestnew3: function () {
        return db.load(`select c.c_alias,a.title_alias,a.public_date,a.c_ID , a.id,a.title,a.abstract,a.author,DATEDIFF(CURDATE(), a.public_date) AS day,a.featured,a.views,a.isActive,a.images,c.ID,c.tc_ID,c.c_Name,c.c_Large 
        from article a join categories c on a.c_ID=c.ID
        where a.isActive=1 and a.featured=1 and a.c_ID=5 OR a.c_ID=6 having (day>0 and day<7)
        order by rand() LIMIT 1`);
    },
    // 10 the viewest  article
    viewest: function () {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID where isActive=1 order by views DESC limit 10`)
    },
    //top 10 categories
    top10_chungkhoan: function () {
        return db.load(`(SELECT * FROM article a join categories c on a.c_ID=c.ID
            WHERE a.c_ID=1 and a.isActive=1 ORDER BY rand() LIMIT 1) UNION
             (SELECT * FROM article a join categories c on a.c_ID=c.ID
                 WHERE a.c_ID=2 and a.isActive=1 ORDER BY  rand() ,a.public_date DESC LIMIT 1)`);
    },
    top10_doanhnghiep: function () {
        return db.load(`(SELECT * FROM article a join categories c on a.c_ID=c.ID
            WHERE a.c_ID=3 and a.isActive=1 ORDER BY rand() LIMIT 1) UNION
             (SELECT * FROM article a join categories c on a.c_ID=c.ID
                 WHERE a.c_ID=4 and a.isActive=1 ORDER BY  rand() ,a.public_date DESC LIMIT 1)`);
    },
    top10_taichinh: function () {
        return db.load(`(SELECT * FROM article a join categories c on a.c_ID=c.ID
            WHERE a.c_ID=5 and a.isActive=1 ORDER BY rand() LIMIT 1) UNION
             (SELECT * FROM article a join categories c on a.c_ID=c.ID
                 WHERE a.c_ID=6 and a.isActive=1 ORDER BY  rand() ,a.public_date DESC LIMIT 1)`);
    },
    detailById: function (Id) {
        return db.load(`select * from ${TBL_article} where id = ${Id}`);
    },
    // get 5 articles same categories
    ArtSameCat: function (c_alias) {
        return db.load(`SELECT * FROM ${TBL_article} a join categories c on a.c_ID=c.ID
            WHERE c.c_alias='${c_alias}' and a.isActive=1 ORDER BY rand() LIMIT 5`)
    },
    detailByTitle: function (title) {
        return db.load(`select * from ${TBL_article} where title_alias = '${title}'`);
    },

    allSearch: function(key)
    {
        return db.load(`SELECT * FROM ${TBL_article} WHERE MATCH(title,abstract,content,tag,author) AGAINST('${key}')`);
    }
    
}