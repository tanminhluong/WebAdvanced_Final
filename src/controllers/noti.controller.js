const Notification = require('../models/NotificationModel');
const Faculty = require('../models/UserModel');
const {mongooseToObject} = require('../util/mongoose')

class NotifyController {

    index(req, res, next) {
        let notiQuery = Notification.find()
        let facultyQuery = Faculty.find({role: 'khoa'})

        Promise.all([facultyQuery, notiQuery])
        .then(([faculties, notifications]) => {
            res.render('notifications/all', {
                notifications,
                faculties
            })
        })
        .catch(err => {})
    }

    filter(req, res, next) {
        // if(!req.query.fcId) {
        //     res.redirect('/notifications')
        // }
        
        let notiQuery = Notification.find({ownerId: req.query.filter})
        let facultyQuery = Faculty.find({role: 'khoa'})

        Promise.all([facultyQuery, notiQuery])
        .then(([faculties, notifications]) => {
            
            res.render('notifications/all', {
                notifications,
                faculties
            })
        })
        .catch(err => {})
    }

    // [POST] /notifications/:fcId
    create(req, res, next) {
        const formData = req.body;
        console.log(formData.owner)
        formData.ownerId = req.params.fcId
        let newNoti = new Notification(formData)
        newNoti.save()
        .then(() => {
            res.redirect('back')
        })
        .catch(next)
    }

    update(req, res, next) {
        Notification.updateOne({_id: req.params.id}, req.body)
        .then(() => {
            res.redirect('back')
        })
        .catch(next)
    }

    delete(req, res, next) {
        Notification.deleteOne({_id: req.params.id})
        .then(() => {
            res.redirect('back')
        })
        .catch(next)
    }

    // [GET] /notifications/detail/:id
    detail(req, res, next) {

        Notification.findOne({_id: req.params.id})
        .then((notification) => {
            
            res.render('notifications/detail', {
                notification: mongooseToObject(notification)
            })
        })
        .catch(next)
    }



}

module.exports = new NotifyController()