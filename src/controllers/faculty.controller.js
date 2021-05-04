const Notification = require('../models/NotificationModel');
const User = require('../models/UserModel');
const {mongooseToObject, multipleMongooseToObject} = require('../util/mongoose')

class FacultyController {

    // [GET] /faculty/:fcid
    index(req, res, next){

        const fcId = req.params.fcid
        let facultyQuery = User.findOne({fcId: fcId})
        let notiQuery = Notification.find({ownerId: fcId}).sort({createdAt: 'desc'})

        Promise.all([facultyQuery, notiQuery])
        .then(([faculty, notifications]) => {
           
            res.render('faculty', {
                faculty: faculty,
                notifications: multipleMongooseToObject(notifications)
            })
        })
        .catch(next)

        
    }
}

module.exports = new FacultyController()
