const { validationResult } = require('express-validator');
const moment = require('moment');

const util = require('../util');
const transactionsModel = require('../models/transaction');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {

        let maxReceiptNo = await transactionsModel.getMaxReceiptNo(req.db);
        req.body.receipt_id = +maxReceiptNo + 1;

        if (!req.body.trn_date) {
            req.body.trn_date = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        if (!req.body.financial_year) {
            var currentYear = +moment().format('YYYY');
            req.body.financial_year = currentYear + '-' + (currentYear + 1);
        }

        let insertedTransactions = await transactionsModel.insertTransaction(req.db, req.body);
        return util.sendResponse(req, res, insertedTransactions);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
