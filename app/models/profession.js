const getAllProfessions = async (db) => {
    return await db('professions').withSchema('Account').select('*');
};

const insertProfession = async (db, data) => {
    let result = await db('professions').withSchema('Account').insert({
        "name": data.name
    }).returning('*');
    return result[0];
};

module.exports = {
    getAllProfessions,
    insertProfession
};
