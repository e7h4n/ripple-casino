var randomstring = require('randomstring');
var crypto = require('crypto');
var pool = require('./pool');
var _ = require('underscore');

var user = {
    create: function (user, callback) {
        var salt = getSalt();
        var password = encryptPassword(user.password, salt);

        user = _.pick(_.defaults({
            password: password,
            salt: salt
        }, user), 'username', 'password', 'salt');

        user.createdTime = +new Date();
        user.updatedTime = +new Date();

        pool.acquire(function (err, db) {
            if (err) {
                callback(err);
                return;
            }

            db.collection('users').insert(user, function (err, result) {
                console.log(err);
                callback(err, result[0]);
                pool.release(db);
            });
        });
    },

    query: function (user, callback) {
        pool.acquire(function (err, db) {
            if (err) {
                callback(err);
                return;
            }

            db.collection('users').findOne(user, function (err, result) {
                debugger;
                callback(err, result);
                pool.release(db);
            })
        });
    },

    update: function (user, callback) {
        pool.acquire(function (err, db) {
            if (err) {
                callback(err);
                return;
            }

            user = _.pick(user, 'username', 'password', 'lastlogin');

            if (user.password) {
                user.slat = getSalt();
                user.password = encryptPassword(user.password, user.slat);
            }

            user.updatedTime = +new Date();
            var search = _.pick(user, 'username');

            user = _.omit(user, 'username');

            db.collection('user').findAndModify(search, [['username', 1]], user, function (err, result) {
                callback(err, result);
                pool.release(db);
            })
        });
    },

    encryptPassword: encryptPassword
};

function getSalt() {
    return randomstring.generate();
}

function encryptPassword(password, salt) {
    var shasum = crypto.createHash('sha1');
    shasum.update(password + salt);
    return shasum.digest('hex');
}

module.exports = user;
