const express = require('express');
const router = express.Router();

const SiteController = require('../controllers/site.controller');
const {securedLv1} = require('../middlewares/secured.middleware')

router.get('/', securedLv1, SiteController.index)


module.exports = router