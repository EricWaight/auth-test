var exports = module.exports = {}

//Render signup form
exports.signup = function(req, res) {
 
    res.render('signup');
 
}

//Render signin form
exports.signin = function(req, res) {
 
    res.render('signin');
 
}

//Render dashboard
exports.dashboard = function(req, res) {
 
    res.render('dashboard');
 
}

//Render logout 
exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}