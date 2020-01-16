const { validationResult } = require('express-validator');

const util = require('../util');
const headModel = require('../models/head');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let updatedHead = await headModel.updateHead(req.db, req.params.id, req.body);
        return util.sendResponse(req, res, updatedHead);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'UPDATE_ERROR', e);
    }

};
