const express = require('express');
const router = express.Router();

const SiteController = require('../controllers/site.controller');
const secured = require('../middlewares/secured.middleware')

router.get('/', secured, SiteController.index)


module.exports = router