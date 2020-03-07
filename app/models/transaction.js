const _ = require('lodash');
const moment = require('moment');

const insertTransactions = async (db, data) => {
    try {
        var i = 0;
        let trnData = {
            "haribhakt_id": data.haribhakt_id,
            "description": data.description ? data.description : null,
            "trn_type": data.trn_type,
            "financial_year": data.financial_year,
            "receipt_id": data.receipt_id ? data.receipt_id : null,
            "trn_date": data.trn_date ? data.trn_date : null,
            "voucher_id": data.voucher_id ? data.voucher_id : null,
            "bill_no": data.bill_no ? data.bill_no : null,
            "user_id": data.user_id
        };
        let insertedTrns = [];
        let result;
        let totalAmount = 0;
        while (i < data.transactions.length) {
            trnData.sub_head_id = data.transactions[i].sub_head_id;
            trnData.amount = data.transactions[i].amount;
            result = await db('transactions').withSchema('Account').insert(trnData).returning('*');
            totalAmount += +data.transactions[i].amount;
            insertedTrns.push(result[0]);
            i++;
        }

        let trnDateObj = moment(data.trn_date, "YYYY-MM-DD");
        let trnDate = trnDateObj.format('YYYY-MM-DD');
        let OCRecord = await db('opening_closing_balance').withSchema('Account').select('*').where({ 'date': trnDate });
        if (OCRecord && OCRecord.length > 0) {
            let closingBalance = +OCRecord[0].closing_balance;
            if (data.trn_type.toUpperCase() === 'C') {
                closingBalance += totalAmount;
                await db('opening_closing_balance')
                    .withSchema('Account')
                    .update({
                        closing_balance: closingBalance,
                        date_modified: db.raw('NOW()')
                    })
                    .where('date', trnDate);
                await db('opening_closing_balance')
                    .withSchema('Account')
                    .update({
                        opening_balance: db.raw('?? + ' + totalAmount, ['opening_balance']),
                        closing_balance: db.raw('?? + ' + totalAmount, ['closing_balance']),
                        date_modified: db.raw('NOW()')
                    })
                    .where('date', '>', trnDate);
            } else if (data.trn_type.toUpperCase() === 'D') {
                closingBalance -= totalAmount;
                await db('opening_closing_balance')
                    .withSchema('Account')
                    .update({
                        closing_balance: closingBalance,
                        date_modified: db.raw('NOW()')
                    })
                    .where('date', trnDate);
                await db('opening_closing_balance')
                    .withSchema('Account')
                    .update({
                        opening_balance: db.raw('?? - ' + totalAmount, ['opening_balance']),
                        closing_balance: db.raw('?? - ' + totalAmount, ['closing_balance']),
                        date_modified: db.raw('NOW()')
                    })
                    .where('date', '>', trnDate);
            }
        } else {
            let latestRecord = await db('opening_closing_balance')
                .withSchema('Account')
                .select('*')
                .where('date', '<', trnDate)
                .orderBy('date', 'desc')
                .limit(1);
            let closingBalance = +latestRecord[0].closing_balance;
            let latestDate = moment(latestRecord[0].date).add(1, 'days');
            let trnsToInsert = [];
            while (latestDate.isBefore(trnDateObj)) {
                trnsToInsert.push({
                    date: latestDate.format('YYYY-MM-DD'),
                    opening_balance: closingBalance,
                    closing_balance: closingBalance
                });
                latestDate = latestDate.add(1, 'days');
            }
            if (data.trn_type.toUpperCase() === 'C') {
                trnsToInsert.push({
                    date: latestDate.format('YYYY-MM-DD'),
                    opening_balance: closingBalance,
                    closing_balance: closingBalance + totalAmount
                });
            } else if (data.trn_type.toUpperCase() === 'D') {
                trnsToInsert.push({
                    date: latestDate.format('YYYY-MM-DD'),
                    opening_balance: closingBalance,
                    closing_balance: closingBalance - totalAmount
                });
            }
            await db('opening_closing_balance').withSchema('Account').insert(trnsToInsert);
        }

        return insertedTrns;
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

const getMaxReceiptNo = async (db, financialYear) => {
    try {
        let result = await db('transactions')
            .withSchema('Account')
            .where({ 'financial_year': financialYear })
            .max('receipt_id');
        return result[0].max;
    } catch (e) {
        throw e;
    }
};

const getMaxVoucherNo = async (db, financialYear) => {
    try {
        let result = await db('transactions')
            .withSchema('Account')
            .where({ 'financial_year': financialYear })
            .max('voucher_id');
        return result[0].max;
    } catch (e) {
        throw e;
    }
};

module.exports = {
    insertTransactions,
    updateTransaction,
    getAllTransactions,
    getTransactionById,
    deleteTransactionById,
    getMaxReceiptNo,
    getMaxVoucherNo
};
