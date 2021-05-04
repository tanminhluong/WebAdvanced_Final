const express = require('express');
const router = express.Router();

const NotifyController = require('../controllers/noti.controller');

const {securedLv1} = require('../middlewares/secured.middleware')

router.get('/pages/:page', securedLv1,  NotifyController.index)

router.get('/filter/pages/:page', securedLv1, NotifyController.filter)

router.put('/:id',securedLv1 , NotifyController.update)

router.delete('/:id', securedLv1, NotifyController.delete)

router.post('/:fcId', securedLv1, NotifyController.create)

router.get('/detail/:id', securedLv1, NotifyController.detail)


module.exports = router