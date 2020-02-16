module.exports = require('knex')({
    client: 'pg',
    version: process.env.DB_VERSION,
    connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE,
        timezone: 'Asia/Kolkata'
    }
});
