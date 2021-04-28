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
                    
                    res.render('home', {faculty: null, userProfile: student, posts: posts});
                })
    
                .catch(next)
                break;
            case 'khoa': 
                let facultyQuery = User.findOne({fcId: req.user.fcId})
                Promise.all([postsQuery, facultyQuery])
                .then(([ posts, faculty]) => {
                    
                    res.render('home', {userProfile: null, faculty: faculty , posts: posts});
                })

                .catch(next)
                break;
            case 'admin':
                Promise.all([postsQuery])
                .then(([ posts]) => {
                    
                    res.render('home', {title: "Profile", faculty: null,  userProfile: null,  role: 'admin', posts: posts});
                })
    
                .catch(next)
                break;
        }

        

        

        
    }
}

module.exports = new SiteController()

