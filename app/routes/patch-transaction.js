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
        let updatedTransactions = await transactionsModel.updateTransaction(req.db, req.params.id, req.body);
        return util.sendResponse(req, res, updatedTransactions);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
