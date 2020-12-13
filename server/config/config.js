// ===============================================
//  Puerto
// ===============================================
process.env.PORT = process.env.PORT || 3000;


// ===============================================
//  Entorno
// ===============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


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