const express = require('express');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PORT} = process.env;


const loginController = require('../controllers/login.controller')
const User = require('../models/UserModel')
const initializePassport = require('../validators/passport-config')

initializePassport(passport)

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/login/auth/google/callback`
  },
  function( accessToken, refreshToken, profile, done) {
	if(profile._json.hd !== 'student.tdtu.edu.vn'){
		return done(null, false)

	}
	if(profile.id){
		
		User.findOne({googleId: profile.id})
		.then((existingUser) => {
			if(existingUser){
				done(null, existingUser)
			}else {
				new User({
					googleId: profile.id,
					email: profile.emails[0].value,
					name: profile.displayName,
					role: 'student',
					
				})
				.save()
				.then(user => done(null, user))

			}
				
		})
	}
     
  }
));



router.get('/', loginController.main);

router.post('/',  passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: true
}), loginController.userLogin);

router.get('/auth/google',  
        passport.authenticate('google', { scope : ['profile', 'email'] })
);
router.get('/auth/google/callback',  
        passport.authenticate('google', { failureRedirect: '/error', failureFlash: true }),
        loginController.authCB
);

module.exports = router