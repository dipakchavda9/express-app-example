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

module.exports = {
    sendResponse,
    sendErrorResponse
};
