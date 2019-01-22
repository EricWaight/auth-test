//Import Bycrypt, needed to secure passwords
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {

    //Initialize the passport-local strategy, and the user model, which will be passed as an argument.
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    //serialize
    passport.serializeUser(function(user, done) {
 
        done(null, user.id);
 
    });

    // deserialize user 
    passport.deserializeUser(function(id, done) {
 
        User.findById(id).then(function(user) {
 
            if (user) {
 
            done(null, user.get());
 
            } else {
 
            done(user.errors, null);
 
            }
 
        });
 
    });

    //Define our custom strategy with our instance of the LocalStrategy
    passport.use('local-signup', new LocalStrategy(
 
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
     
        },

        //Callback function 
        function(req, email, password, done) {
            
            //Hashed password generating function
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
             
            };

            //Using the Sequelize user model we initialized earlier as User, we check to see if the user already exists, and if not we add them
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
             
                if (user)
             
                {
             
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
             
                } else
             
                {
             
                    var userPassword = generateHash(password);
             
                    var data =
             
                        {
                            email: email,
             
                            password: userPassword,
             
                            firstname: req.body.firstname,
             
                            lastname: req.body.lastname
             
                        };
             
             
                    User.create(data).then(function(newUser, created) {
             
                        if (!newUser) {
             
                            return done(null, false);
             
                        }
             
                        if (newUser) {
             
                            return done(null, newUser);
             
                        }
             
                    });
             
                }
             
            });
        }
     
    ));

    //LOCAL SIGNIN
    //In this strategy, the isValidPassword function compares the password entered with the bCrypt comparison method since we stored our password with bcrypt.
    passport.use('local-signin', new LocalStrategy(
 
        {
 
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
 
            passwordField: 'password',
 
            passReqToCallback: true // allows us to pass back the entire request to the callback
 
            },
 
 
            function(req, email, password, done) {
 
                var User = user;
 
                var isValidPassword = function(userpass, password) {
 
                return bCrypt.compareSync(password, userpass);
 
            }
 
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
 
                if (!user) {
 
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
 
                }
 
                if (!isValidPassword(user.password, password)) {
 
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
 
                }
 
                var userinfo = user.get();
                return done(null, userinfo);
 
 
            }).catch(function(err) {
 
                console.log("Error:", err);
 
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
 
            });
 
        }
 
    ));
}

