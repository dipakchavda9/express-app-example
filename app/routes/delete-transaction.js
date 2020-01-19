const { validationResult } = require('express-validator');

const util = require('../util');
const transactionModel = require('../models/transaction');

module.exports = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
        }

        let selectResult = await transactionModel.getTransactionById(req.db, req.params.id);
        if (selectResult === false) {
            return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Transaction exists having id = ' + req.params.id);
        }

        let deleteResult = await transactionModel.deleteTransactionById(req.db, req.params.id);
        return util.sendResponse(req, res, deleteResult);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};
