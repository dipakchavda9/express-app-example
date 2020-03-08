const util = require('../util');
const loginModel = require('../models/login');

module.exports = async (req, res) => {
    try {
        
        let token = await loginModel.getCognitoToken();

        if (!token) {
            return util.sendErrorResponse(req, res, 500, 'TOKEN_ERROR', 'Error getting token.');
        }

        return util.sendResponse(req, res, {token});
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
