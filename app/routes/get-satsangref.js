const util = require('../util');
const satsangrefModel = require('../models/satsangref');

module.exports = async (req, res) => {
    try {
        let result = await satsangrefModel.getAllSatsangrefs(req.db);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};
