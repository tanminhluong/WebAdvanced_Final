const jwt = require('jsonwebtoken')


module.exports.securedLv1 = (req, res, next) => {

  if(req.isAuthenticated()) {
    return next()
  }
    
  res.redirect('/login')
    
};

module.exports.securedLv2 = (req, res, next) => {
  const {role} = req.user;
  if(role != 'student') {
    return next()

  }
  res.redirect('back')
  
}