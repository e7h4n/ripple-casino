var querystring = require('querystring');
var url = require('url');
var _ = require('underscore');

module.exports = function (req, res, next) {
    res.locals.req = req;

    res.locals.url = function (path, params) {
        if (!params && _.isObject(path)) {
            params = path;
            path = null;
        } else if (!params) {
            params = {};
        }

        var urlObj = url.parse(req.originUrl);
        if (!path) {
            path = urlObj.pathname;
        }

        var query = _.extend({}, urlObj.query, params);

        return url.format({
            pathname: path,
            query: query
        });
    };

    next();
};
