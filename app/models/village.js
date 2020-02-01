const getAllVillages = async (db) => {
    return await db('villages').withSchema('Account').select('*');
};

const insertVillage = async (db, data) => {
    let result = await db('villages').withSchema('Account').insert({
        "name": data.name
    }).returning('*');
    return result[0];
};

module.exports = {
    getAllVillages,
    insertVillage
};
