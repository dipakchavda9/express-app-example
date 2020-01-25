const { validationResult } = require('express-validator');

const util = require('../util');
const FATrnModel = require('../models/fixed-asset-transaction');

module.exports = async (req, res) => {
    try {
        let filters = {};
        if (req.query.subHeadId) {
            filters.sub_head_id = req.query.subHeadId;
        }
        if (req.query.financialYear) {
            filters.financial_year = req.query.financialYear;
        }
        let result = await FATrnModel.getAllFATransactions(req.db, filters);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};
