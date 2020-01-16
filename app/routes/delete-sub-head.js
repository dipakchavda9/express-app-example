const { validationResult } = require('express-validator');

const util = require('../util');
const subHeadModel = require('../models/sub-head');

module.exports = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
        }

        let result = await subHeadModel.getSubHeadById(req.db, req.params.id);
        if (result === false) {
            return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Sub Head exists having id = ' + req.params.id);
        }

        let deleteResult = await subHeadModel.deleteSubHeadById(req.db, req.params.id);
        return util.sendResponse(req, res, deleteResult);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};
