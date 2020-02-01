const { validationResult } = require('express-validator');

const util = require('../util');
const haribhaktModel = require('../models/haribhakt');

let getHaribhakt = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let data = await haribhaktModel.getHaribhaktByMobile(req.db, req.query.mobile);
        return util.sendResponse(req, res, data);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

module.exports = getHaribhakt;
