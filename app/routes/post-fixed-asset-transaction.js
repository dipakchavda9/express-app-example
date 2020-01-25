const { validationResult } = require('express-validator');
const moment = require('moment');

const util = require('../util');
const FATransactionsModel = require('../models/fixed-asset-transaction');

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

        let existingFATrn = await FATransactionsModel.getFATransactionBySubHeadAndFY(req.db, req.body.sub_head_id, req.body.financial_year);

        if (!existingFATrn) {
            var data = {
                "sub_head_id": req.body.sub_head_id,
                "financial_year": req.body.financial_year,
                "user_id": req.body.user_id
            };
            var year = +(req.body.financial_year.split('-')[0]);
            var prevTrn = await FATransactionsModel.getFATransactionPrevToYear(req.db, req.body.sub_head_id, year);
            if (!prevTrn) {
                data.last_year_balance = 0;
            } else {
                data.last_year_balance = (+prevTrn.last_year_balance) + (+prevTrn.current_year_income) - (+prevTrn.current_year_expense);
            }
            if (req.body.trn_type === 'C') {
                data.current_year_income = req.body.amount;
                data.current_year_expense = 0;
            } else if (req.body.trn_type === 'D') {
                data.current_year_income = 0;
                data.current_year_expense = req.body.amount;
            }
            data.year = year;
            var updatedFATrn = await FATransactionsModel.insertFATransaction(req.db, data);
        } else {
            var data = {
                "user_id": req.body.user_id
            };
            if (req.body.trn_type === 'C') {
                data.current_year_income = +existingFATrn.current_year_income + req.body.amount;
            } else if (req.body.trn_type === 'D') {
                data.current_year_expense = +existingFATrn.current_year_expense + req.body.amount;
            }
            var updatedFATrn = await FATransactionsModel.updateFATransaction(req.db, existingFATrn.id, data);
        }

        return util.sendResponse(req, res, updatedFATrn);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
