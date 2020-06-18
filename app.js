const express = require('express');
const app = express();
const port = 3000;
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const cookieParser = require('cookie-parser')
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { 
      //secure: true 
    }
}))

app.use(express.urlencoded({ extended: true }));
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers:{
        section: express_handlebars_sections()
    }
}))
app.set('view engine', 'hbs');

app.use(async function(req, res, next){
    if(req.session.isAuthenticated === null){
        req.session.isAuthenticated = false;
    }
    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authUser;
    if(req.session.isAuthenticated === true){
        if(req.session.authUser.r_ID != 1){
            res.locals.permission = true;
        }
    }
    next();
});

app.use(express.static('./public/'));
app.use('/', require('./routes/Home.route'));
app.use('/', require('./routes/_account.route'));


app.use(function (req, res) {
    res.render('404');
})

app.listen(port, () => {
    console.log(`Server start port at http://localhost:${port}`);
})