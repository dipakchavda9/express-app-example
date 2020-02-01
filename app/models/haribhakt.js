const professionModel = require('./profession');

let getProfessionName = (id) => {
    for(var i = 0; i < professionList.length; i++) {
        if (id === professionList[i].id) {
            return professionList[i].description
        }
    }
    return '';
}

const getAllHaribhakts = async (db) => {
    professionList = professionModel.getAllProfessions(db);
    let data = await db
        .withSchema('Account')
        .select(
            'haribhakt.*', 
            'cv.name AS village_current_name', 
            'nv.name AS village_native_name',
            'bg.group AS blood_group_name',
            'sr.name AS satsang_ref_name')
        .from('haribhakt')
        .leftJoin('villages as cv', 'haribhakt.village_current', 'cv.id')
        .leftJoin('villages as nv', 'haribhakt.village_native', 'nv.id')
        .leftJoin('blood_group as bg', 'haribhakt.blood_group', 'bg.id')
        .leftJoin('satsang_refs as sr', 'haribhakt.satsang_ref', 'sr.id');

    data = data.map((haribhakt) => {
        var professionNames = {};
        if (haribhakt.profession !== null && haribhakt.profession.length !== 0) {
            haribhakt.profession.forEach((professionId) => {
                professionNames[professionId] = getProfessionName(professionId);
            });
            haribhakt.profession = professionNames;
        }
        return haribhakt;
    });
    return data;
};

const getHaribhaktByMobile = async (db, mobile) => {
    professionList = professionModel.getAllProfessions(db);
    let data = await db
        .withSchema('Account')
        .select(
            'haribhakt.*', 
            'cv.name AS village_current_name', 
            'nv.name AS village_native_name',
            'bg.group AS blood_group_name',
            'sr.name AS satsang_ref_name')
        .from('haribhakt')
        .where('mobile1', mobile)
        .orWhere('mobile2', mobile)
        .leftJoin('villages as cv', 'haribhakt.village_current', 'cv.id')
        .leftJoin('villages as nv', 'haribhakt.village_native', 'nv.id')
        .leftJoin('blood_group as bg', 'haribhakt.blood_group', 'bg.id')
        .leftJoin('satsang_refs as sr', 'haribhakt.satsang_ref', 'sr.id');

    data = data.map((haribhakt) => {
        var professionNames = {};
        if (haribhakt.profession !== null && haribhakt.profession.length !== 0) {
            haribhakt.profession.forEach((professionId) => {
                professionNames[professionId] = getProfessionName(professionId);
            });
            haribhakt.profession = professionNames;
        }
        return haribhakt;
    });
    return data;
};

const getHaribhaktByVillage = async (db, village) => {
    professionList = professionModel.getAllProfessions(db);
    let data = await db
        .withSchema('Account')
        .select(
            'haribhakt.*', 
            'cv.name AS village_current_name', 
            'nv.name AS village_native_name',
            'bg.group AS blood_group_name',
            'sr.name AS satsang_ref_name')
        .from('haribhakt')
        .where('village_current', village)
        .orWhere('village_native', village)
        .leftJoin('villages as cv', 'haribhakt.village_current', 'cv.id')
        .leftJoin('villages as nv', 'haribhakt.village_native', 'nv.id')
        .leftJoin('blood_group as bg', 'haribhakt.blood_group', 'bg.id')
        .leftJoin('satsang_refs as sr', 'haribhakt.satsang_ref', 'sr.id');

    data = data.map((haribhakt) => {
        var professionNames = {};
        if (haribhakt.profession !== null && haribhakt.profession.length !== 0) {
            haribhakt.profession.forEach((professionId) => {
                professionNames[professionId] = getProfessionName(professionId);
            });
            haribhakt.profession = professionNames;
        }
        return haribhakt;
    });
    return data;
};

const insertHaribhakt = async (db, data) => {
    let dataToInsert = {
        firstname: data.firstname ? data.firstname : null,
        lastname: data.lastname ? data.lastname : null,
        address_current: data.address_current ? data.address_current : null,
        address_native: data.address_native ? data.address_native : null,
        village_current: data.village_current ? data.village_current : null,
        village_native: data.village_native ? data.village_native : null,
        mobile1: data.mobile1 ? data.mobile1 : null,
        mobile2: data.mobile2 ? data.mobile2 : null,
        email: data.email ? data.email : null,
        blood_group: data.blood_group ? data.blood_group : null,
        profession: data.profession ? data.profession : null,
        satsang_ref: data.satsang_ref ? data.satsang_ref : null,
        no_members: data.no_members ? data.no_members : null
    };
    let insertedHaribhakt = await db('haribhakt').withSchema('Account').insert(dataToInsert).returning('*');
    return insertedHaribhakt;
};

module.exports = {
    getHaribhaktByMobile,
    getHaribhaktByVillage,
    getAllHaribhakts,
    insertHaribhakt
};
