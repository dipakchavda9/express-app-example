let express = require('express');
let bodyParser = require('body-parser');
let responseTime = require('response-time');
let helmet = require('helmet');
let addRequestId = require('express-request-id')();
let dotenv = require('dotenv');
dotenv.config();

let logger = require('./app/logger');
let routes = require('./app/routes');

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

app.get('/', function (req, res) {
    throw 123;
    res.send('hello, world!')
});

app.use(logger.errorLogger);

app.listen(PORT, () => {
    console.log('Server started on Port: ', PORT);
});

module.exports = app;
