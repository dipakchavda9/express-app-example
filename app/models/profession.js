const getAllProfessions = async (db) => {
    return await db('professions').withSchema('Account').select('*');
};

module.exports = {
    getAllProfessions
};
