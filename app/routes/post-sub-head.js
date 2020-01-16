const { validationResult } = require('express-validator');

const util = require('../util');
const subHeadModel = require('../models/sub-head');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let insertedSubHead = await subHeadModel.insertSubHead(req.db, req.body);
        return util.sendResponse(req, res, insertedSubHead);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
