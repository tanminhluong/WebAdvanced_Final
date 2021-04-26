const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.controller');
const secured = require('../middlewares/secured.middleware')
const adSecured = require('../middlewares/adminSecured.middleware')



router.get('/', secured, adSecured,  AdminController.index)
router.post('/register', secured, adSecured, AdminController.register)

module.exports = router