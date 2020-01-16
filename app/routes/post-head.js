const { validationResult } = require('express-validator');

const util = require('../util');
const headModel = require('../models/head');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let insertedHead = await headModel.insertHead(req.db, req.body);
        return util.sendResponse(req, res, insertedHead);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
