const { validationResult } = require('express-validator');

const util = require('../util');
const transactionModel = require('../models/transaction');

const getAllTransactions = async (req, res) => {
    try {
        let result = await transactionModel.getAllTransactions(req.db);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

const getTransactionById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
        }
    
        let result = await transactionModel.getTransactionById(req.db, req.params.id);
        if (result === false) {
            return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Transaction exists having id = ' + req.params.id);
        }
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

module.exports = {
    getAllTransactions,
    getTransactionById
}
