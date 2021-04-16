const express = require('express');
const router = express.Router();
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

const loginController = require('../controllers/login.controller')

router.get('/', loginController.main);
router.get('/auth/google',  
        passport.authenticate('google', { scope : ['profile', 'email'] })
);
router.get('/auth/google/callback',  
        passport.authenticate('google', { failureRedirect: '/error' }),
        loginController.authCB
);

module.exports = router