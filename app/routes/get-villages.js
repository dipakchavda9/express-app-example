const util = require('../util');
const villageModel = require('../models/village');

module.exports = async (req, res) => {
    try {
        let result = await villageModel.getAllVillages(req.db);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};
