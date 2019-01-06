// Authentication function
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'No authorization, You must be logged in');
            res.redirect('/users/login');
        }
    }
}