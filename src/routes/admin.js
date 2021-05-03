const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.controller');
const {securedLv1} = require('../middlewares/secured.middleware')
const adSecured = require('../middlewares/adminSecured.middleware')



router.get('/', securedLv1, adSecured,  AdminController.index)
router.post('/register', securedLv1, adSecured, AdminController.register)

module.exports = router