const util = require('../util');
const reportModel = require('../models/report');

module.exports = async (req, res) => {

    try {
        
        let data = await reportModel.getDashboardData(req.db);

        return util.sendResponse(req, res, data);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
