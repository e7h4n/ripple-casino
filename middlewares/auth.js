module.exports = function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/login?redirect=' + encodeURIComponent(req.url));
    } else {
        next();
    }
};
