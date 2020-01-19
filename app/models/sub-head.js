const _ = require('lodash');

const insertSubHead = async (db, data) => {
    try {
        let result = await db('sub_head_master').withSchema('Account').insert({
            "head_id": data.head_id,
            "name": data.name,
            "status": (data.status ? data.status : true)
        }).returning('*');
        return result[0];
    } catch (e) {
        throw e;
    }
};

const updateSubHead = async (db, id, data) => {
    try {
        let dataToUpdate = {};
        if (data.hasOwnProperty('name')) {
            dataToUpdate.name = data.name;
        }
        if (data.hasOwnProperty('head_id')) {
            dataToUpdate.head_id = data.head_id;
        }
        if (data.hasOwnProperty('status')) {
            dataToUpdate.status = data.status;
        }
        if (_.isEmpty(dataToUpdate)) {
            throw 'No data to update.'
        }
        dataToUpdate['date_modified'] = db.fn.now();

        let result = await db('sub_head_master')
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

const getAllSubHeads = async (db) => {
    try {
        return await db('sub_head_master')
            .withSchema('Account')
            .select(
                'sub_head_master.id',
                'sub_head_master.head_id',
                'sub_head_master.name',
                'sub_head_master.status',
                'sub_head_master.date_created',
                'sub_head_master.date_modified',
                'head_master.name AS head_name'
            )
            .innerJoin('head_master', 'sub_head_master.head_id', 'head_master.id');
    } catch (e) {
        throw e;
    }
};

const getSubHeadById = async (db, id) => {
    try {
        let result = await db('sub_head_master').withSchema('Account').select('*').where({ 'id': id });
        if (result.length === 0) {
            return false;
        }
        return result[0];
    } catch (e) {
        throw e;
    }
};

const deleteSubHeadById = async (db, id) => {
    try {
        let result = await db('sub_head_master').withSchema('Account').del().where({ 'id': id }).returning('*');
        console.log(result);
        return result[0];
    } catch (e) {
        throw e;
    }
};

module.exports = {
    insertSubHead,
    updateSubHead,
    getAllSubHeads,
    getSubHeadById,
    deleteSubHeadById
};
