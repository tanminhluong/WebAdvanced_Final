const loginRouter = require('./login');
const siteRouter = require('./site');




function route(app) {
    app.use('/login', loginRouter);
    app.use('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    })
    app.use('/',  siteRouter);
}

module.exports = route