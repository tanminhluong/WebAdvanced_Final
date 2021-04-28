const express = require('express');
const router = express.Router();

const NotifyController = require('../controllers/noti.controller');

const secured = require('../middlewares/secured.middleware')



router.get('/', secured, NotifyController.index)

router.post('/:fcId', secured, NotifyController.create)

router.get('/detail/:id', secured, NotifyController.detail)


module.exports = router