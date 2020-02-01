const util = require('../util');
const professionModel = require('../models/profession');

module.exports = async (req, res) => {
    try {
        let result = await professionModel.getAllProfessions(req.db);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};
