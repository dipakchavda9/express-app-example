let express = require('express');
let bodyParser = require('body-parser');
let responseTime = require('response-time');
let helmet = require('helmet');
let addRequestId = require('express-request-id')();
let dotenv = require('dotenv');
dotenv.config();
let { checkSchema } = require('express-validator');

let logger = require('./app/logger');
let routes = require('./app/routes');
let schemas = require('./app/schemas');

let app = express();
let PORT = process.env.PORT | 3000;

app.use(bodyParser.json());

app.use(responseTime());

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
    }
}));
app.use(helmet.noCache());

app.use(addRequestId);

app.use(logger.logger);

app.get('/heads', checkSchema(schemas.head), routes.getHead);

app.use(logger.errorLogger);

app.listen(PORT, () => {
    console.log('Server started on Port: ', PORT);
});

module.exports = app;
