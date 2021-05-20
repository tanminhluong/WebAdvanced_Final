const express = require('express');
const router = express.Router();
var multer = require('multer');
const mongodb = require("mongodb");
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      if (file.mimetype.startsWith('image/')) {
        callback(null, 'public/images');
      }
      else if (file.mimetype.startsWith('video/')) {
        callback(null, 'public/videos');
      }
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }
  });
var upload = multer({ storage: storage });
const securedLogin = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.redirect("/login");
};
const securedRole = (req, res, next) => {
    if (req.user.role != "admin") {
        res.redirect('back')
    }
    next();
};
router.get('/', securedLogin, securedRole, (req, res, next) => {
    req.app.db.collection("users").find({
        "role": {
            $nin: ['admin', 'student']
        }
    }).toArray(function (err, result) {
        res.render('adminPage', {
            user : req.user,
            role : req.user.role,
            faculties: result
        })
    })
})
router.post('/update/:id', securedLogin, securedRole, (req, res) => {
    const formData = req.body;
    var id_user = req.params.id;
    console.log(formData)
    console.log(id_user);
    // req.app.db.collection("users").remove({
    //     "_id" : mongodb.ObjectID(id)
    // }, (err, user) => {
    //     if (!err) {
    //         res.json({
    //             "status": "success",
    //             "message": "User has been Delete."
    //         });
    //     }
    // });
    res.redirect('back');
})
router.post('/remove', securedLogin, securedRole,upload.any("litsfile"), (req, res) => {
    var id = req.body.id_noti;
    req.app.db.collection("users").remove({
        "_id" : mongodb.ObjectID(id)
    }, (err, user) => {
        if (!err) {
            res.json({
                "status": "success",
                "message": "User has been Delete."
            });
        }
    });
})
router.post('/register', securedLogin, securedRole, (req, res) => {
    const formData = req.body;
    console.log(formData);
    req.app.db.collection("users").insertOne({
        "username": formData.username,
        "password": formData.password,
        "role": formData.role,
        "email": formData.email,
        "name": formData.name,
        "picture": '/images/icons/favicon.ico'
    }, (err, user) => {
        if (!err) {
            res.redirect('back');
        }
    });

})

module.exports = router