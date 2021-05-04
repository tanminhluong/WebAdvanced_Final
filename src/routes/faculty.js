const express = require('express');
const router = express.Router();

const FacultyController = require('../controllers/faculty.controller');

const {securedLv1, securedLv2} = require('../middlewares/secured.middleware')



router.get('/:fcid', securedLv1, securedLv2, FacultyController.index)


module.exports = router