const { validationResult } = require('express-validator');

const util = require('../util');
const satsangrefModel = require('../models/satsangref');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let insertedSatsangref = await satsangrefModel.insertSatsangref(req.db, req.body);
        return util.sendResponse(req, res, insertedSatsangref);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
