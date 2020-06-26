const db = require('../utils/db');

const TBL_tag = 'tag';
module.exports = {
    getAll: () => {
        return db.load(`select * from ${TBL_tag} `);
    },
    getByName: (name, limit, offset) => {
        return db.load(`SELECT * FROM tag_article ta ,article a,${TBL_tag} t,categories c
        WHERE ta.id_article=a.id and t.ID=ta.id_tag and c.ID=a.c_ID and t.Name like '%${name}%' limit ${limit} offset ${offset}`);
    },
    countByTags: async function (name) {
        const rows = await db.load(`select count(*) as total FROM tag_article ta ,article a,${TBL_tag} t
        WHERE ta.id_article=a.id and t.ID=ta.id_tag and t.Name like '%${name}%'`);
        return rows[0].total;
    }
}