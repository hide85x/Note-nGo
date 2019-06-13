module.exports= {
    ensureAuthenticated: function(req, res, next){
        if (req.isAuthenticated()) { // isAuthenticated mamy z passport js
            return next();
        }
        req.flash("error_msg", " You are not authorized to touch that shit! Login first!");
        res.redirect('/users/login')
    }
}