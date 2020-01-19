const _ = require('lodash');

const insertTransaction = async (db, data) => {
    try {
        let result = await db('transactions').withSchema('Account').insert({
            "haribhakt_id": data.haribhakt_id,
            "description": data.description ? data.description : null,
            "sub_head_id": data.sub_head_id,
            "trn_type": data.trn_type,
            "amount": data.amount,
            "financial_year": data.financial_year,
            "receipt_id": data.receipt_id,
            "trn_date": data.trn_date ? data.trn_date : null,
            "voucher_id": data.voucher_id ? data.voucher_id : null,
            "bill_no": data.bill_no ? data.bill_no : null,
            "user_id": data.user_id
        }).returning('*');
        return result[0];
    } catch (e) {
        throw e;
    }
};

const updateTransaction = async (db, id, data) => {
    try {
        let dataToUpdate = {};
        if (data.hasOwnProperty('haribhakt_id')) {
            dataToUpdate.haribhakt_id = data.haribhakt_id;
        }
        if (data.hasOwnProperty('description')) {
            dataToUpdate.description = data.description;
        }
        if (data.hasOwnProperty('sub_head_id')) {
            dataToUpdate.sub_head_id = data.sub_head_id;
        }
        if (data.hasOwnProperty('trn_type')) {
            dataToUpdate.trn_type = data.trn_type;
        }
        if (data.hasOwnProperty('amount')) {
            dataToUpdate.amount = data.amount;
        }
        if (data.hasOwnProperty('financial_year')) {
            dataToUpdate.financial_year = data.financial_year;
        }
        if (data.hasOwnProperty('trn_date')) {
            dataToUpdate.trn_date = data.trn_date;
        }
        if (data.hasOwnProperty('voucher_id')) {
            dataToUpdate.voucher_id = data.voucher_id;
        }
        if (data.hasOwnProperty('bill_no')) {
            dataToUpdate.bill_no = data.bill_no;
        }
        if (_.isEmpty(dataToUpdate)) {
            throw 'No data to update.'
        }
        dataToUpdate['date_modified'] = db.fn.now();

        let result = await db('transactions')
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

const getAllTransactions = async (db) => {
    try {
        return await db('transactions').withSchema('Account').select('*');
    } catch (e) {
        throw e;
    }
};

const getTransactionById = async (db, id) => {
    try {
        let result = await db('transactions').withSchema('Account').select('*').where({ 'id': id });
        if (result.length === 0) {
            return false;
        }
        return result[0];
    } catch (e) {
        throw e;
    }
};

const deleteTransactionById = async (db, id) => {
    try {
        let result = await db('transactions').withSchema('Account').del().where({ 'id': id }).returning('*');
        return result[0];
    } catch (e) {
        throw e;
    }
};

const getMaxReceiptNo = async (db) => {
    try {
        let result = await db('transactions').withSchema('Account').max('receipt_id');
        return result[0].max;
    } catch (e) {
        throw e;
    }
};

module.exports = {
    insertTransaction,
    updateTransaction,
    getAllTransactions,
    getTransactionById,
    deleteTransactionById,
    getMaxReceiptNo
};
