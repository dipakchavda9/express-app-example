const { validationResult } = require('express-validator');

const util = require('../util');
const haribhaktModel = require('../models/haribhakt');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let existingHaribhakt = await haribhaktModel.getHaribhaktById(req.db, req.params.id);
        if (!existingHaribhakt) {
            return util.sendErrorResponse(req, res, 404, 'NO_RECORD_EXISTS', 'No Haribhakt exists having id = ' + req.params.id);
        }

        let updatedHaribhakt = await haribhaktModel.updateHaribhakt(req.db, req.params.id, req.body);
        return util.sendResponse(req, res, updatedHaribhakt);
    } catch (e) {
        console.log(e);
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }

};
