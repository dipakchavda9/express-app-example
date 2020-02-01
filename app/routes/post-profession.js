const { validationResult } = require('express-validator');

const util = require('../util');
const professionModel = require('../models/profession');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let insertedProfession = await professionModel.insertProfession(req.db, req.body);
        return util.sendResponse(req, res, insertedProfession);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
