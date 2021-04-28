const session = require('express-session');
const flash = require('express-flash')

const loginRouter = require('./login');
const siteRouter = require('./site');
const postsRouter = require('./post');
const adminRouter = require('./admin');
const notificationRouter = require('./notification');
const facultyRouter = require('./faculty');

function route(app) {
    

    app.use('/login', loginRouter);

    app.use('/logout', (req, res) => {
        req.logout();
        req.session.destroy();
        res.redirect('/login');
    })

    app.use('/admin', adminRouter);

    app.use('/error', (req, res) => {
        req.flash('error', 'Invalid email')
        res.redirect('/login');
    })

    app.use('/faculty', facultyRouter)

    app.use('/notifications', notificationRouter)

    app.use('/posts', postsRouter);
    
    app.use('/',  siteRouter);
}

module.exports = route