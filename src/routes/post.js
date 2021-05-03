const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post.controller');

const {securedLv1} = require('../middlewares/secured.middleware')



router.get('/', securedLv1, PostController.index)
router.post('/', securedLv1, PostController.createPost)

module.exports = router