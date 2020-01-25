const _ = require('lodash');

const insertFATransaction = async (db, data) => {
    try {
        var i = 0;
        let trnData = {
            "sub_head_id": data.sub_head_id,
            "last_year_balance": data.last_year_balance,
            "current_year_income": data.current_year_income,
            "current_year_expense": data.current_year_expense,
            "financial_year": data.financial_year,
            "user_id": data.user_id,
            "year": data.year
        };
        result = await db('fixed_asset_transactions').withSchema('Account').insert(trnData).returning('*');
        return result[0];
    } catch (e) {
        throw e;
    }
};

const updateFATransaction = async (db, id, data) => {
    try {
        let dataToUpdate = {};
        if (data.hasOwnProperty('sub_head_id')) {
            dataToUpdate.sub_head_id = data.sub_head_id;
        }
        if (data.hasOwnProperty('last_year_balance')) {
            dataToUpdate.last_year_balance = data.last_year_balance;
        }
        if (data.hasOwnProperty('current_year_income')) {
            dataToUpdate.current_year_income = data.current_year_income;
        }
        if (data.hasOwnProperty('current_year_expense')) {
            dataToUpdate.current_year_expense = data.current_year_expense;
        }
        if (data.hasOwnProperty('financial_year')) {
            dataToUpdate.financial_year = data.financial_year;
        }
        if (data.hasOwnProperty('user_id')) {
            dataToUpdate.user_id = data.user_id;
        }
        if (_.isEmpty(dataToUpdate)) {
            throw 'No data to update.'
        }
        dataToUpdate['date_modified'] = db.fn.now();

        let result = await db('fixed_asset_transactions')
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

const getAllFATransactions = async (db, filters) => {
    try {
        let query = db('fixed_asset_transactions').withSchema('Account').select('*');
        if (filters) {
            query.where(filters);
        }
        return await query;
    } catch (e) {
        throw e;
    }
};

const getFATransactionBySubHeadAndFY = async (db, subHeadId, financialYear) => {
    try {
        let result = await db('fixed_asset_transactions')
            .withSchema('Account')
            .select('*')
            .where({
                'financial_year': financialYear,
                'sub_head_id': subHeadId
            });
        if (result.length === 0) {
            return false;
        }
        return result[0];
    } catch (e) {
        throw e;
    }
};

const getFATransactionPrevToYear = async (db, subHeadID, year) => {
    try {
        let result = await db('fixed_asset_transactions')
            .withSchema('Account')
            .select('*')
            .where('year', '<', year)
            .where('sub_head_id', subHeadID)
            .orderBy('year', 'desc')
            .limit(1);
        if (result.length === 0) {
            return false;
        }
        return result[0];
    } catch (e) {
        throw e;
    }
};

const deleteFATransactionById = async (db, id) => {
    try {
        let result = await db('fixed_asset_transactions').withSchema('Account').del().where({ 'id': id }).returning('*');
        return result[0];
    } catch (e) {
        throw e;
    }
};

module.exports = {
    insertFATransaction,
    updateFATransaction,
    getAllFATransactions,
    getFATransactionBySubHeadAndFY,
    deleteFATransactionById,
    getFATransactionPrevToYear
};
