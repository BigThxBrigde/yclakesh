const { services } = require('../dao/service');


/********** data query api *********** */

/**
 * To know if the admin is online
 * @param {*} ctx 
 * @param {*} next 
 */
let isOnline = (ctx, next) => !!ctx.session.user

/**
 * validate user
 * @param {Object} ctx 
 * @param {Function} next 
 */
let validate = async (ctx, next) => {
    let params = ctx.request.body;
    var result = await services.User.validate(params.name, params.password);
    if (result) {
        ctx.session.user = params.name;
    }
    ctx.body = {
        success: result
    };
}

/********** pages render api *********** */

/**
 * auth user, if not login redirect to /login
 * @param {Object} ctx 
 * @param {Function} next 
 */
let auth = async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.redirect('/login');
    } else {
        if (next) {
            await next();
        }
    }
};

/**
 * redner login page
 * @param {Object} ctx 
 * @param {Function} next 
 */
let renderLoginPage = async (ctx, next) => {
    await ctx.render('login', { name: 'login' });
}

/**
 * rend admin page
 */
let renderAdminPage = async (ctx, next) => {
    await next();
    await ctx.render('layout.ejs');
}

module.exports = {
    isOnline,
    validate,
    auth,
    renderLoginPage,
    renderAdminPage
}