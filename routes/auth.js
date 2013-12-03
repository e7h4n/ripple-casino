var loginForm = require('../forms/login');
var registryForm = require('../forms/registry');
var async = require('async');
var userLogical = require('../logicals/user');
var _ = require('underscore');

exports.doLogin = function (req, res) {
    loginForm.handle(req, {
        success: onFormProcess.bind(this, false),
        error: onFormProcess.bind(this, true),
        empty: onFormProcess.bind(this, true)
    });

    function onFormProcess(err, form) {
        res.locals.form = form;

        if (err) {
            res.render('login');
            return;
        }

        var formUser = form.data;
        userLogical.query({
            username: formUser.username
        }, function (err, user) {
            if (err) {
                res.send(500, err);
                return;
            }

            if (!user) {
                // set form error
                console[console.debug ? 'debug' : 'log']('-- user not exist ----------------');
                res.render('login');
                return;
            }

            var valid = user.password === userLogical.encryptPassword(formUser.password, user.salt);
            if (!valid) {
                // set form error
                console[console.debug ? 'debug' : 'log']('-- not valid ----------------');
                res.render('login');
                return;
            }

            req.session = req.session || {};
            req.session.user = _.omit(user, 'salt', 'password');

            var redirect = req.param('redirect') ? req.param('redirect') : '/';
            res.redirect(redirect);
        });
    }
};

exports.login = function (req, res) {
    res.locals.form = loginForm;

    res.render('login');
};

exports.doRegistry = function (req, res) {
    registryForm.handle(req, {
        success: onFormProcess.bind(this, false),
        error: onFormProcess.bind(this, true),
        empty: onFormProcess.bind(this, true)
    });

    function onFormProcess(err, form) {
        res.locals.form = form;

        if (err) {
            res.render('registry');
            return;
        }

        var formUser = form.data;
        userLogical.create(formUser, function (err, user) {
            if (err) {
                res.send(500, err);
                return;
            }

            req.session = req.session || {};
            req.session.user = _.omit(user, 'salt', 'password');

            var redirect = req.param('redirect') ? req.param('redirect') : '/';
            res.redirect(redirect);
        });
    }
};

exports.registry = function (req, res) {
    res.locals.form = registryForm;

    res.render('registry');
};
