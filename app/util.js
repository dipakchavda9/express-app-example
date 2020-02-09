const moment = require('moment');

const sendResponse = (req, res, data) => {
    return res.status(200).json({
        code: 'OK',
        data: data,
        requestId: req.id
    })
};

const sendErrorResponse = (req, res, statusCode, errorCode, error) => {
    return res.status(statusCode).json({
        code: errorCode,
        error: error,
        requestId: req.id
    });
};

const getFinancialYear = (dateStr) => {
    if (!dateStr) {
        var date = moment();
    } else {
        var date = moment(dateStr, 'YYYY-MM-DD HH:mm:ss');
    }
    var fiscalyear = "";
    if (date.month() <= 2) {
      fiscalyear = (date.year() - 1) + "-" + date.year();
    } else {
      fiscalyear = date.year() + "-" + (date.year() + 1);
    }
    return fiscalyear;
}

module.exports = {
    sendResponse,
    sendErrorResponse,
    getFinancialYear
};
