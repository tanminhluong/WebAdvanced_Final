const session = require('express-session');

const loginRouter = require('./login');
const siteRouter = require('./site');
const postsRouter = require('./post');
const adminRouter = require('./admin');



function route(app) {
    app.use('/admin', adminRouter);

    app.use('/login', loginRouter);

    app.use('/logout', (req, res) => {
        req.logout();
        req.session.destroy();
        res.redirect('/login');
    })

    app.use('/error', (req, res) => {
        res.redirect('/login');
    })

    app.use('/posts', postsRouter);
    
    app.use('/',  siteRouter);
}

module.exports = route