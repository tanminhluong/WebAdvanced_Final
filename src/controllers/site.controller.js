const Post = require('../models/PostModel');
const User = require('../models/UserModel');


class SiteController {
    index(req, res, next) {

        const {role} = req.user;
        let postsQuery = Post.find()
        switch(role){
            case 'student':
                let studentQuery = User.findOne({googleId: req.user.googleId})

                Promise.all([studentQuery, postsQuery])
                .then(([student, posts]) => {
                    
                    res.render('home', {title: "Profile", userProfile: student, posts: posts});
                })
    
                .catch(next)
                break;
            case 'khoa': 
                Promise.all([postsQuery])
                .then(([ posts]) => {
                    
                    res.render('home', { userProfile: null,  role: 'admin', posts: posts});
                })

                .catch(next)
                break;
            case 'admin':
                Promise.all([postsQuery])
                .then(([ posts]) => {
                    
                    res.render('home', {title: "Profile", userProfile: null,  role: 'admin', posts: posts});
                })
    
                .catch(next)
                break;
        }

        

        

        
    }
}

module.exports = new SiteController()

