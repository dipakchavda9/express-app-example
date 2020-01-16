const { validationResult } = require('express-validator');

const util = require('../util');
const subHeadModel = require('../models/sub-head');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    let selectResult = await subHeadModel.getSubHeadById(req.db, req.params.id);
    if (selectResult === false) {
        return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Sub Head exists having id = ' + req.params.id);
    }

    try {
        let updatedSubHead = await subHeadModel.updateSubHead(req.db, req.params.id, req.body);
        return util.sendResponse(req, res, updatedSubHead);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
