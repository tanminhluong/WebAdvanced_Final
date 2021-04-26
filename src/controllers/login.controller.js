const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const session = require('express-session')


class LoginController{

    // [GET] /login
    main(req, res) {
        res.render('login');
    }

    // [POST] /login
    userLogin(req, res, next) {
        const {username, password} = req.body;
        
        let account = undefined;
        User.findOne({username: username})
        .then(acc => {
            
            if(!acc) {
                
                throw new Error('User not found')
               
            }
            account = acc
            return password === acc.password

        })
        .then(matched => {
            
            if(!matched) {
                throw new Error('Wrong password')
            }

            const {JWT_SECRET} = process.env;

            jwt.sign({
                username: account.username,
                role: account.role,
                
            }, JWT_SECRET, {
                expiresIn: '1h'
            }, (err, token) => {
                if(err) throw err
                req.session.jwtToken = token
                return res.redirect('/')
            })

            
        })
        .catch(next)

       
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