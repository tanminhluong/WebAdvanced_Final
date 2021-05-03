const express = require('express');
const router = express.Router();

const NotifyController = require('../controllers/noti.controller');

const {securedLv1} = require('../middlewares/secured.middleware')



router.get('/pages/:page',  NotifyController.index)

router.get('/filter', NotifyController.filter)

router.put('/:id', NotifyController.update)

router.delete('/:id', NotifyController.delete)

router.post('/:fcId', securedLv1, NotifyController.create)

router.get('/detail/:id', securedLv1, NotifyController.detail)


module.exports = router