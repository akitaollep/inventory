module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //return res.redirect('/login');
        return res.forbidden('You are not permitted to access this action');
    }
};