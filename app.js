const express = require('express');
const app = express();
const port = 3000;
const exphbs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');

app.use(express.urlencoded({ extended: true }));
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers:{
        section: express_handlebars_sections()
    }
}))
app.set('view engine', 'hbs');

app.use(express.static('./public/'));
app.use('/', require('./routes/Home.route'));
app.use('/', require('./routes/_account.route'));


app.use(function (req, res) {
    res.render('404');
})

app.listen(port, () => {
    console.log(`Server start port at http://localhost:${port}`);
})