const categoryModel = require('../models/category.model');
module.exports = function (app) {
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
    app.use(async function (req, res, next) {
        const rows = await categoryModel.all();
        res.locals.lcCategories = rows;
        next();
    })
    
  }
  