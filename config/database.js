// config/database.js

// default to a 'localhost' configuration:
var connection_string = 'mongodb://localhost/crcDb';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

module.exports = {
    //'url' : 'mongodb://localhost/crcDb'

    //'url' : 'mongodb://admin:c-rz57VydxUt@mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/'
    //'url' : 'mongodb://admin:c-rz57VydxUt@nodejs-crcyouth.rhcloud.com:8080/'
    'url' : connection_string
};