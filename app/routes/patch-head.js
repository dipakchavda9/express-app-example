const { validationResult } = require('express-validator');

const util = require('../util');
const headModel = require('../models/head');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    let selectResult = await headModel.getHeadById(req.db, req.params.id);
    if (selectResult === false) {
        return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Head exists having id = ' + req.params.id);
    }

    try {
        let updatedHead = await headModel.updateHead(req.db, req.params.id, req.body);
        return util.sendResponse(req, res, updatedHead);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
