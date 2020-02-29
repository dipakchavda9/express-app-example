const { validationResult } = require('express-validator');

const util = require('../util');
const reportModel = require('../models/report');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let data = await reportModel.getRojmelData(req.db, req.query.date);
        return util.sendResponse(req, res, data);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
