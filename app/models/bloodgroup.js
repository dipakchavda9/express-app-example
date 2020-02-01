const getAllBloodgroups = async (db) => {
    return await db('blood_group').withSchema('Account').select('*');
};

module.exports = {
    getAllBloodgroups
};
