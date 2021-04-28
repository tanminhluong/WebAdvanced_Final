const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {

  if(req.isAuthenticated()) {
    return next()
  }
    
  res.redirect('/login')
    
};