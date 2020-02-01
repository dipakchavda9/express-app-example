const { validationResult } = require('express-validator');

const util = require('../util');
const villageModel = require('../models/village');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let insertedVillage = await villageModel.insertVillage(req.db, req.body);
        return util.sendResponse(req, res, insertedVillage);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
