const util = require('../util');
const bloodgroupModel = require('../models/bloodgroup');

module.exports = async (req, res) => {
    try {
        let result = await bloodgroupModel.getAllBloodgroups(req.db);
        return util.sendResponse(req, res, result);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};
