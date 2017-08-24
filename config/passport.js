var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    //bcrypt = require('bcrypt');
    bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({
        id: id
    }, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    function(email, password, done) {
        // User.findOne({
        //     or : [
        //         { email: email },
        //         { username: email }
        //     ]
        // }, function(err, user) {
        //     if (err) {
        //         return done(err);
        //     }
        //     if (!user) {
        //         return done(null, false, {
        //             message: 'Incorrect email.'
        //         });
        //     }

        //     bcrypt.compare(password, user.password, function(err, res) {
        //         if (!res)
        //             return done(null, false, {
        //                 message: 'Invalid Password'
        //             });
        //         var returnUser = {
        //             email: user.email,
        //             createdAt: user.createdAt,
        //             id: user.id
        //         };
        //         return done(null, returnUser, {
        //             message: 'Logged In Successfully'
        //         });
        //     });
        // });

        User.findOne({
            or : [
                { email: email },
                { username: email }
            ]
        }).exec(function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect email.'
                });
            }
            if (user.status != 'New' && user.status != 'Active'){
                return done(null, false, {
                    message: 'User not active.'
                });
            }

            bcrypt.compare(password, user.password, function(err, res) {
                if (!res)
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
                sails.log.debug(user);
                var returnUser = {
                    email: user.email,
                    createdAt: user.createdAt,
                    id: user.id,
                    role: user.role
                };
                return done(null, returnUser, {
                    message: 'Logged In Successfully'
                });
            });
        });
    }
));