//Import the auth controller and define the signup route.
var authController = require('../controllers/authcontroller.js');

module.exports = function(app, passport) {
    
    //Create route for signup
    app.get('/signup', authController.signup);

    //Create route for signin
    app.get('/signin', authController.signin);

    //Create route for posting to signup
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
 
        failureRedirect: '/signup'
    }
 
    ));
    //Create route for dashboard
    app.get('/dashboard', isLoggedIn ,authController.dashboard);

    //Create route for logout
    app.get('/logout',authController.logout);

    //Create route for posting to signin
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
 
        failureRedirect: '/signin'
    }
 
    ));

    //Check to see if user is logged in
    function isLoggedIn(req, res, next) {
 
        if (req.isAuthenticated())
         
            return next();
             
        res.redirect('/signin');
     
    }
 
}

