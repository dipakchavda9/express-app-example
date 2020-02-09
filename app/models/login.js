const axios = require('axios');
const querystring = require('querystring');

const validateCredentials = async (db, username, password) => {
    var result = await db
        .withSchema('Account')
        .count('id')
        .from('users')
        .where({
            username,
            password,
            status: 'Active'
        });
    if (result[0].count > 0) {
        return true;
    }
    return false;
};

let getCognitoToken = async () => {
    let data = {
        grant_type: 'client_credentials',
        client_id: process.env.COGNITO_CLIENT_ID,
        client_secret: process.env.COGNITO_CLIENT_SECRET
    };
    try {
        let response = await axios.post(process.env.COGNITO_URL, querystring.stringify(data));
        return response.data.access_token;
    } catch (e) {
        return false;
    }
};

module.exports = {
    validateCredentials,
    getCognitoToken
};
