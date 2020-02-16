const { validationResult } = require('express-validator');

const util = require('../util');
const reportModel = require('../models/report');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        
        let data = await reportModel.getCreditTrnsByDateRange(req.db, req.query.start_date, req.query.end_date);

        return util.sendResponse(req, res, data);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
