const Notification = require('../models/NotificationModel');
const {mongooseToObject} = require('../util/mongoose')

class NotifyController {
    index(req, res, next) {
        Notification.find()
        .then(notifications => {
            res.render('notifications/all', {
                notifications
            })
        })
        .catch(err => {})
    }

    // [POST] /notifications/:fcId
    create(req, res, next) {
        const formData = req.body;
        formData.ownerId = req.params.fcId
        let newNoti = new Notification(formData)
        newNoti.save()
        .then(() => {
            res.redirect('back')
        })
        .catch(next)
    }

    // [GET] /notifications/detail/:id
    detail(req, res, next) {

        Notification.findOne({_id: req.params.id})
        .then((notification) => {
            console.log(notification);
            res.render('notifications/detail', {
                notification: mongooseToObject(notification)
            })
        })
        .catch(next)
    }



}

module.exports = new NotifyController()