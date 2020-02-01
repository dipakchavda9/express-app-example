const professionModel = require('./profession');

let getProfessionName = (id) => {
    for(var i = 0; i < professionList.length; i++) {
        if (id === professionList[i].id) {
            return professionList[i].description
        }
    }
    return '';
}

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

module.exports = {
    getHaribhaktByMobile
};
