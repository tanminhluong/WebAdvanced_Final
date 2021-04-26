const User = require('../models/UserModel');
const { multipleMongooseToObject} = require('../util/mongoose')


class AdminController {
    index(req, res, next) {

        User.find({role: 'khoa'})
        .then((faculties) => {
            res.render('adminPage', {
                faculties: multipleMongooseToObject(faculties)
            })
        })
        .catch(next)
        
    }

    register(req, res) {
        const formData = req.body;

        formData.role = 'khoa'

        let newUser = new User(formData )

        newUser.save()
        .then(() => {
            res.redirect('back')
        })
        .catch(err => { })
    }
    
}

module.exports = new AdminController();