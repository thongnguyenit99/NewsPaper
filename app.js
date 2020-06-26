const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public/'));
require('./middlewares/view.mdw')(app);
require('./middlewares/session.mdw')(app);
require('./middlewares/locals.mdw')(app);


app.use('/', require('./routes/home.route'));
app.use('/account', require('./routes/_account.route'));
app.use('/article', require('./routes/article.route'));
app.use('/categories', require('./routes/categories.route'));
app.use('/tags', require('./routes/tag.route'));


app.use(function (req, res) {
    res.render('404');
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500');
  })

app.listen(port, () => {
    console.log(`Server start port at http://localhost:${port}`);
})