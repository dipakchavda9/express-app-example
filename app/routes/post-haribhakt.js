const { validationResult } = require('express-validator');

const util = require('../util');
const haribhaktModel = require('../models/haribhakt');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {

        let insertedHaribhakt = await haribhaktModel.insertHaribhakt(req.db, req.body);

        return util.sendResponse(req, res, insertedHaribhakt);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
