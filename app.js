const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');

require('./config/passport')(passport);

const app = express();
const ideas = require('./routes/ideas');
const users = require('./routes/users');

const env= process.env.NODE_ENV
const db= require('./config/database');
mongoose.promise = global.promise;
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})

    .then(() => console.log(`MongoDb connected in ${env}`))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session())

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));


//global variables
app.use(function (req, res, next) {   // w kazdym widoku mozemy używać teraz propsa success_msg i error_msg i error
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user= req.user || null
    next();
})


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res, next) => {
    const title = 'Welcome from const title'
    res.render('index', {
        title: title
    });
});

app.use('/ideas', ideas);
app.use('/users', users);

app.get('/about', (req, res, next) => {
    res.render('about')
});


const port = process.env.PORT || 5000; // heroku bedzie uzywal naszego process.env
app.listen(port, () => {
    console.log(`server started at port ${port}, enjoy Your stay!`);
})
