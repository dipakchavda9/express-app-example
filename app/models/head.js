const _ = require('lodash');

const insertHead = async (db, data) => {
    try {
        let result = await db('head_master').withSchema('Account').insert({
            "name": data.name,
            "type": data.type,
            "status": (data.status ? data.status : true)
        }).returning('*');
        return result[0];
    } catch (e) {
        throw e;
    }
};

const updateHead = async (db, id, data) => {
    try {
        let dataToUpdate = {};
        if (data.hasOwnProperty('name')) {
            dataToUpdate.name = data.name;
        }
        if (data.hasOwnProperty('type')) {
            dataToUpdate.type = data.type;
        }
        if (data.hasOwnProperty('status')) {
            dataToUpdate.status = data.status;
        }
        if (_.isEmpty(dataToUpdate)) {
            throw 'No data to update.'
        }
        dataToUpdate['date_modified'] = db.fn.now();

        let result = await db('head_master')
            .withSchema('Account')
            .update(dataToUpdate)
            .where({
                'id': id
            })
            .returning('*');
        return result[0];
    } catch (e) {
        throw e;
    }
};

module.exports = {
    insertHead,
    updateHead
};
