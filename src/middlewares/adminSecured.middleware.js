const jwt = require('jsonwebtoken')
const session = require('express-session')

module.exports = (req, res, next) => {

  if(req.user.role !== 'admin'){
      res.redirect('back')
  }
  
  next()
    
};