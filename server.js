const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const helmet = require('helmet');
const addRequestId = require('express-request-id')();
const dotenv = require('dotenv');
dotenv.config();
const { checkSchema } = require('express-validator');
const cors = require('cors')

const logger = require('./app/logger');
const routes = require('./app/routes');
const schemas = require('./app/schemas');
const middlewares = require('./app/middlewares');
const db = require('./app/db');

let app = express();
let PORT = process.env.PORT | 3000;

app.use(bodyParser.json());

app.use(cors());

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

app.get('/sub-heads', routes.getSubHead.getAllSubHeads);
app.get('/sub-heads/:id', checkSchema(schemas.getDeleteSubHead), routes.getSubHead.getSubHeadById);
app.post('/sub-heads', checkSchema(schemas.postSubHead), routes.postSubHead);
app.patch('/sub-heads/:id', checkSchema(schemas.patchSubHead), routes.patchSubHead);
app.delete('/sub-heads/:id', checkSchema(schemas.getDeleteSubHead), routes.deleteSubHead);

app.get('/transactions', routes.getTransaction.getAllTransactions);
app.get('/transactions/:id', checkSchema(schemas.getDeleteTransaction), routes.getTransaction.getTransactionById);
app.post('/transactions', checkSchema(schemas.postTransaction), routes.postTransaction);
app.patch('/transactions/:id', checkSchema(schemas.patchTransaction), routes.patchTransaction);
app.delete('/transactions/:id', checkSchema(schemas.getDeleteTransaction), routes.deleteTransaction);

app.get('/fixed-asset-transactions', routes.getFixedAssetTransaction);
app.post('/fixed-asset-transactions', checkSchema(schemas.postFixedAssetTransaction), routes.postFixedAssetTransaction);

app.get('/villages', routes.getVillages);
app.post('/villages', checkSchema(schemas.postVillage), routes.postVillage);

app.get('/professions', routes.getProfession);
app.post('/professions', checkSchema(schemas.postProfession), routes.postProfession);

app.get('/satsangrefs', routes.getSatsangref);
app.post('/satsangrefs', checkSchema(schemas.postSatsangref), routes.postSatsangref);

app.get('/bloodgroups', routes.getBloodgroup);

app.get('/haribhakts', checkSchema(schemas.getHaribhakt), routes.getHaribhakt);
app.post('/haribhakts', checkSchema(schemas.postHaribhakt), routes.postHaribhakt);
app.patch('/haribhakts/:id', checkSchema(schemas.patchHaribhakt), routes.patchHaribhakt);

app.post('/login', checkSchema(schemas.postLogin), routes.postLogin);

app.get('/reports/dashboard', routes.getReportDashboard);

app.get('/reports/credit-transactions', checkSchema(schemas.getCreditTrns), routes.getCreditTrns);
app.get('/reports/rojmel', checkSchema(schemas.getRojmel), routes.getRojmel);

app.use(logger.errorLogger);

if (require.main.filename === __filename) {
    app.listen(PORT, () => {
        console.log('Server started on Port: ', PORT);
    });
}

module.exports = app;
