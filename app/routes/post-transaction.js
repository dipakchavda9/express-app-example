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

        if (!req.body.financial_year) {
            var currentYear = +moment().format('YYYY');
            req.body.financial_year = currentYear + '-' + (currentYear + 1);
        }

        if (req.body.trn_type.toUpperCase() === 'C') {
            let maxReceiptNo = await transactionsModel.getMaxReceiptNo(req.db, req.body.financial_year);
            if (!maxReceiptNo) {
                maxReceiptNo = 0;
            }
            req.body.receipt_id = +maxReceiptNo + 1;
            delete req.body.voucher_id;
            delete req.body.bill_no;
        } else if (req.body.trn_type.toUpperCase() === 'D') {
            let maxVoucherNo = await transactionsModel.getMaxVoucherNo(req.db, req.body.financial_year);
            if (!maxVoucherNo) {
                maxVoucherNo = 0;
            }
            req.body.voucher_id = +maxVoucherNo + 1;
            delete req.body.receipt_id;
        }

        if (!req.body.trn_date) {
            req.body.trn_date = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        let insertedTransactions = await transactionsModel.insertTransactions(req.db, req.body);
        return util.sendResponse(req, res, insertedTransactions);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
