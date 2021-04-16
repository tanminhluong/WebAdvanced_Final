const express = require('express');
const router = express.Router();

const SiteController = require('../controllers/site.controller');


const secured = (req, res, next) => {
    if (req.user) {
      return next();
    }
    
    res.redirect("/login");
  };

router.get('/', secured, SiteController.index)


module.exports = router