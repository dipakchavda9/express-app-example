const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const helmet = require('helmet');
const addRequestId = require('express-request-id')();
const dotenv = require('dotenv');
dotenv.config();
const { checkSchema } = require('express-validator');

const logger = require('./app/logger');
const routes = require('./app/routes');
const schemas = require('./app/schemas');
const middlewares = require('./app/middlewares');
const db = require('./app/db');

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

app.use(middlewares.db(db));

app.get('/heads', routes.getHead.getAllHeads);
app.get('/heads/:id', checkSchema(schemas.getDeleteHead), routes.getHead.getHeadById);
app.post('/heads', checkSchema(schemas.postHead), routes.postHead);
app.patch('/heads/:id', checkSchema(schemas.patchHead), routes.patchHead);
app.delete('/heads/:id', checkSchema(schemas.getDeleteHead), routes.deleteHead);

app.use(logger.errorLogger);

app.listen(PORT, () => {
    console.log('Server started on Port: ', PORT);
});

module.exports = app;
