const { validationResult } = require('express-validator');

const util = require('../util');
const logger = require('../logger');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }
    
    try {
        logger.feedbackLogger(req.body);
        return util.sendResponse(req, res, req.body);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
}
