
class SiteController {
    index(req, res, next) {
        const { _raw, _json, ...userProfile } = req.user;
        res.render('home', {title: "Profile", userProfile: userProfile})
    }
}

module.exports = new SiteController()

