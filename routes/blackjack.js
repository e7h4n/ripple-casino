var blackjack = require('../logicals/blackjack');

exports.index = function (req, res) {
    res.render('blackjack/index');
};

exports.create = function (req, res) {
    var amount = req.param('amount');
    amount = parseInt(amount, 10);

    blackjack.create(req.uid, amount, function (err, result) {
        if (err) {
            res.send(500, err);
            return;
        }

        res.redirect('/blackjack/' + result.id);
    });
};

exports.view = function (req, res) {
    blackjack.query(req.uid, function (err, result) {
        if (err) {
            res.send(500, err);
            return;
        }

        res.locals.game = result;
        res.render('blackjack/view');
    });
};

exports.call = function (req, res) {
    blackjack.call(req.uid, function (err, result) {
        if (err) {
            res.send(500, err);
            return;
        }

        res.locals.game = result;
        res.render('blackjack/view');
    });
};

exports.done = function (req, res) {
    blackjack.done(req.uid, function (err, result) {
        if (err) {
            res.send(500, err);
            return;
        }

        res.locals.game = result;
        res.render('blackjack/view');
    });
};
