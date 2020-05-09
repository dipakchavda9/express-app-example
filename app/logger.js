const expressWinston = require('express-winston');
const winston = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');
const {createLogger, format} = winston;
const {combine, timestamp} = format;

const getCWTransport = new CloudWatchTransport({
    logGroupName: process.env.LOG_GROUP, // REQUIRED
    logStreamName: process.env.LOG_STREAM, // REQUIRED
    createLogGroup: false,
    createLogStream: false,
    submissionInterval: 1,
    submissionRetryCount: 3,
    batchSize: 1,
    awsConfig: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.APP_AWS_REGION
    }
});

const getFBCWTransport = new CloudWatchTransport({
    logGroupName: process.env.LOG_GROUP, // REQUIRED
    logStreamName: process.env.LOG_STREAM_FEEDBACKS, // REQUIRED
    createLogGroup: false,
    createLogStream: false,
    submissionInterval: 1,
    submissionRetryCount: 3,
    batchSize: 1,
    awsConfig: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.APP_AWS_REGION
    }
});

const winstonLogger = createLogger({
    transports: [
        getFBCWTransport
    ],
    exceptionHandlers: [
        new winston.transports.Console()
    ],
    exitOnError: false,
    format: combine(
        timestamp(),
        format.json()
    )
});

const logger = expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        getCWTransport
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms {{res.statusCode}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
});

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console(),
        getCWTransport
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms {{res.statusCode}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
});

const feedbackLogger = (message) => {
    try {
        winstonLogger.log({
            level: 'info',
            message: JSON.stringify(message)
        });
    } catch (e) {
        console.log('Feedback Logger Error', e);
    }
};

module.exports = {
    logger,
    errorLogger,
    feedbackLogger
};
