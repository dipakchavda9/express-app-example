const { validationResult } = require('express-validator');

const util = require('../util');
const loginModel = require('../models/login');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        
        let validCredentials = await loginModel.validateCredentials(req.db, req.body.username, req.body.password);

        if (!validCredentials) {
            return util.sendErrorResponse(req, res, 401, 'INVALID_CREDENTIALS', 'The supplied credentials are invalid.');
        }

        let token = await loginModel.getCognitoToken();

        if (!token) {
            return util.sendErrorResponse(req, res, 500, 'TOKEN_ERROR', 'Error getting token.');
        }

        return util.sendResponse(req, res, {token});
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
