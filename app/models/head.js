const _ = require('lodash');

const insertHead = async (db, data) => {
    try {
        let result = await db('head_master').withSchema('Account').insert({
            "name": data.name,
            "type": data.type,
            "transaction_type": data.transaction_type,
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
        if (data.hasOwnProperty('transaction_type')) {
            dataToUpdate.transaction_type = data.transaction_type;
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

const getAllHeads = async (db) => {
    try {
        return await db('head_master').withSchema('Account').select('*');
    } catch (e) {
        throw e;
    }
};

const getHeadById = async (db, id) => {
    try {
        let result = await db('head_master').withSchema('Account').select('*').where({ 'id': id });
        if (result.length === 0) {
            return false;
        }
        return result[0];
    } catch (e) {
        throw e;
    }
};

const deleteHeadById = async (db, id) => {
    try {
        let result = await db('head_master').withSchema('Account').del().where({ 'id': id }).returning('*');
        console.log(result);
        return result[0];
    } catch (e) {
        throw e;
    }
};

module.exports = {
    insertHead,
    updateHead,
    getAllHeads,
    getHeadById,
    deleteHeadById
};
