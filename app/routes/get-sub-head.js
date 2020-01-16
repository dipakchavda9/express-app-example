const { validationResult } = require('express-validator');

const util = require('../util');
const subHeadModel = require('../models/sub-head');

const getAllSubHeads = async (req, res) => {
    try {
        let result = await subHeadModel.getAllSubHeads(req.db);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

const getSubHeadById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
        }
    
        let result = await subHeadModel.getSubHeadById(req.db, req.params.id);
        if (result === false) {
            return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Sub Head exists having id = ' + req.params.id);
        }
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

module.exports = {
    getAllSubHeads,
    getSubHeadById
}
