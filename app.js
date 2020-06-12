const express = require('express');
const app = express();
const port = 3000;
const exphbs = require('express-handlebars');

app.use(express.urlencoded({ extended: true }));
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs'
}))
app.set('view engine', 'hbs');

app.use(express.static('./public/'));
app.use('/', require('./routes/Home.route'));
app.use('/', require('./routes/Sign.route'));
//app.use('/', require('./routes/Admin.route'));
//app.use('/', require('./routes/Reg.route'));

app.use(function (req, res) {
    res.render('404');
})

app.listen(port, () => {
    console.log(`Server start port at http://localhost:${port}`);
})