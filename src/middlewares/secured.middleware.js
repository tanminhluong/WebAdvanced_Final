const jwt = require('jsonwebtoken')
const session = require('express-session')

module.exports = (req, res, next) => {

  if(!req.session.jwtToken){
    res.redirect('/login');
  } 
  let token = req.session.jwtToken

    const {JWT_SECRET} = process.env
    jwt.verify(token, JWT_SECRET, (err, data) => {
      if(err) {
          throw new Error('invalid token')
      }
      if(data.role === 'admin' || data.role === 'khoa'){
        req.user = data
      }
      next()
    })
    
    
};