const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post.controller');

const secured = require('../middlewares/secured.middleware')



router.get('/', secured, PostController.index)
router.post('/', secured, PostController.createPost)

module.exports = router