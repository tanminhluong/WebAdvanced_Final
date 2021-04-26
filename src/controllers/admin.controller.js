const User = require('../models/UserModel');

class AdminController {
    index(req, res) {


        res.render('adminPage')
    }

    register(req, res) 
    {}
}

module.exports = new AdminController();