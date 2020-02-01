const getAllVillages = async (db) => {
    return await db('villages').withSchema('Account').select('*');
};

module.exports = {
    getAllVillages
};
