const { validationResult } = require('express-validator');

const util = require('../util');

module.exports = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    return util.sendResponse(req, res, req.body);
};
