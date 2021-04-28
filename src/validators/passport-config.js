const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel')


function initialize(passport) {

    const authenticateUser = (req, username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if(err) return done(err)

            if(!user) return done(null, false, req.flash('message', 'User not found'))

            if(user.password !== password) {
                return done(null, false, req.flash('message', 'Invalid password'))
            }

            return done(null, user);
        })
        
    }

    passport.use(new LocalStrategy( {passReqToCallback: true, usernameField: 'username'}, authenticateUser))

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    })
}

module.exports = initialize