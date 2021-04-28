require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');

const route = require('./routes');
const db = require('./config/db');

const app = express();


db.connect();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
  extended: false,
}))
app.use(express.json());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' ,
  cookie: { maxAge: 1000000 }
}));

app.use(cookieParser('keyboard cat'));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.isAuthenticated();
//   next();
// });

route(app)

const port = process.env.PORT || 9090;
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});
