const { validationResult } = require('express-validator');

const util = require('../util');
const headModel = require('../models/head');

const getAllHeads = async (req, res) => {
    try {
        let result = await headModel.getAllHeads(req.db);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

const getHeadById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
        }
    
        let result = await headModel.getHeadById(req.db, req.params.id);
        if (result === false) {
            return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Head exists having id = ' + req.params.id);
        }
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

module.exports = {
    getAllHeads,
    getHeadById
}
