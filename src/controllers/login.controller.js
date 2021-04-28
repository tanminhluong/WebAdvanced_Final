const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');



class LoginController{

    // [GET] /login
    main(req, res) {
        const error = req.flash('error')
        const message = req.flash('message')
        
        res.render('login', {error, message});
    }

    // [POST] /login
    userLogin(req, res, next) {
            

            const {JWT_SECRET} = process.env;

            jwt.sign({
                username: req.user.username,
                
                
            }, JWT_SECRET, {
                expiresIn: '1h'
            }, (err, token) => {
                if(err) throw err
                req.session.jwtToken = token
                return res.redirect('/')
            })

            next()

            
       

       
    }

    

    // [GET] /login/auth/google/callback
    authCB( req, res) {
        const {JWT_SECRET} = process.env;
        

        jwt.sign({
            name: req.user.name
            
        }, JWT_SECRET, {
            expiresIn: '1h'
        }, (err, token) => {
            if(err) throw err
            req.session.jwtToken = token
            return res.redirect('/')
        })
        
    }
}

module.exports = new LoginController();