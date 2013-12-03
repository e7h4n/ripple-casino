var mongodb = require('mongodb');
var poolModule = require('generic-pool');

var pool = poolModule.Pool({
    name: 'mongodb',
    create: function(callback) {
        var server_options = {
            'auto_reconnect': false,
            poolSize: 1
        };
        var db_options = {
            w: -1
        };
        var mongoserver = new mongodb.Server('localhost', 27017, server_options);
        var db = new mongodb.Db('ripple', mongoserver, db_options);
        db.open(function(err,db){
            if(err) {
                callback(err);
                return;
            }

            callback(null,db);
        });
    },
    destroy: function(db) {
        db.close();
    },
    max: 10,
    idleTimeoutMillis: 30000,
    log: false
});

module.exports = pool;
