// ===============================================
//  Port
// ===============================================
process.env.PORT = process.env.PORT || 3000;


// ===============================================
//  Environment
// ===============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===============================================
//  Access Token Expiration
//  60 seg * 60 min * 24 h * 30 day
// ===============================================
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;


// ===============================================
//  App Key
// ===============================================
process.env.APP_KEY = process.env.APP_KEY || 'my-app-key-for-develop';


// ===============================================
//  Data Base
// ===============================================
if (process.env.NODE_ENV === 'dev') {
    //DEV
    process.env.URL_DB = 'mongodb://localhost:27017/coffee';
} else {
    //PRO
    process.env.URL_DB = process.env.MONGO_URI;
}