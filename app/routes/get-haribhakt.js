const { validationResult } = require('express-validator');

const util = require('../util');
const haribhaktModel = require('../models/haribhakt');

let getHaribhakt = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return util.sendErrorResponse(req, res, 422, 'INVALID_INPUT', errors.array());
    }

    try {
        let data;
        if (req.query.mobile) {
            data = await haribhaktModel.getHaribhaktByMobile(req.db, req.query.mobile);
        } else if (req.query.village) {
            data = await haribhaktModel.getHaribhaktByVillage(req.db, req.query.village);
        } else {
            data = await haribhaktModel.getAllHaribhakts(req.db);
        }
        return util.sendResponse(req, res, data);
    } catch (e) {
        return util.sendErrorResponse(req, res, 422, 'DB_ERROR', e);
    }
};

module.exports = getHaribhakt;
