const expressWinston = require('express-winston');
const winston = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch')
const {createLogger, format} = winston;
const {combine, timestamp} = format;

const getCWTransport = () => {
    return new CloudWatchTransport({
        logGroupName: process.env.LOG_GROUP, // REQUIRED
        logStreamName: process.env.LOG_STREAM, // REQUIRED
        createLogGroup: false,
        createLogStream: false,
        submissionInterval: 2000,
        submissionRetryCount: 1,
        batchSize: 20,
        awsConfig: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        }
      });
};

const getFBCWTransport = () => {
    return new CloudWatchTransport({
        logGroupName: process.env.LOG_GROUP, // REQUIRED
        logStreamName: process.env.LOG_STREAM_FEEDBACKS, // REQUIRED
        createLogGroup: false,
        createLogStream: false,
        submissionInterval: 2000,
        submissionRetryCount: 1,
        batchSize: 20,
        awsConfig: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        }
      });
};

const winstonLogger = createLogger({
    transports: [
        getFBCWTransport()
    ],
    exceptionHandlers: [
        getFBCWTransport()
    ],
    exitOnError: false,
    format: combine(
        timestamp(),
        format.json()
    )
});

const logger = expressWinston.logger({
    transports: [
        // new winston.transports.Console()
        getCWTransport()
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
        // new winston.transports.Console()
        getCWTransport()
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
    winstonLogger.log({
        level: 'info',
        message: JSON.stringify(message)
    });
};

module.exports = {
    logger,
    errorLogger,
    feedbackLogger
};
