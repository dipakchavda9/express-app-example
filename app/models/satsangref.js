const getAllSatsangrefs = async (db) => {
    return await db('satsang_refs').withSchema('Account').select('*');
};

const insertSatsangref = async (db, data) => {
    let result = await db('satsang_refs').withSchema('Account').insert({
        "name": data.name
    }).returning('*');
    return result[0];
};

module.exports = {
    getAllSatsangrefs,
    insertSatsangref
};
