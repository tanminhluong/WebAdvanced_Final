require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PORT} = process.env;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/login/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

class LoginController{
    main(req, res) {
        res.render('login')
    }

    auth(req, res) {
       
    }

    authCB( req, res) {
            // Successful authentication, redirect success.
            res.redirect('/');
        }
       
       
    
}

module.exports = new LoginController();