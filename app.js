
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function (){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.cookieParser('asdklfn fdsal fda secret'));
    app.use(express.cookieSession());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function (){
    app.use(express.errorHandler());
});

var viewHelper = require('./middlewares/viewHelper');
var authCheck = require('./middlewares/auth');
app.get('/', viewHelper, routes.index);

var auth = require('./routes/auth');
app.get('/login', viewHelper, auth.login);
app.post('/login', viewHelper, auth.doLogin);
app.get('/registry', viewHelper, auth.registry);
app.post('/registry', viewHelper, auth.doRegistry);

app.get('/blackjack', viewHelper, authCheck, function (req, res) {
    res.send('black jack');
});

http.createServer(app).listen(app.get('port'), function (){
    console.log("Express server listening on port " + app.get('port'));
});
