const express = require('express');
const router = express.Router();

const FacultyController = require('../controllers/faculty.controller');

const secured = require('../middlewares/secured.middleware')



router.get('/:fcid', secured,   FacultyController.index)


module.exports = router