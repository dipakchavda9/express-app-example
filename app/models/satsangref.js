const getAllSatsangrefs = async (db) => {
    return await db('satsang_refs').withSchema('Account').select('*');
};

module.exports = {
    getAllSatsangrefs
};
