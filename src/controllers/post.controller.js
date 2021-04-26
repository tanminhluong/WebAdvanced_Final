const Post = require('../models/PostModel')


class PostController {
    index(req, res, next) {
        
        Post.find({})
        .then(posts => {
            return res.json({data: posts})
        })
        .catch(err => {
            return res.json({data: err.message})
        })
      
    }

    createPost(req, res, next) {
        const {name, avatar, googleId} = req.user;
        const {desc, image} = req.body;

        let post = new Post({
            ownerId: googleId,
            owner: name,
            avatar: avatar,
            desc: desc,
            image: image,
        })

        post.save()
        .then( () => {
            return res.json({code: 0, message: 'Thêm thành công sản phẩm', data: post})
        })
        .catch(err => {
            return res.json({code: 1, message: err.message})
        })

    }
}

module.exports = new PostController()

