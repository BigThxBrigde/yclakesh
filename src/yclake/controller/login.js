const { services } = require('../dao/service');


/********** data query api *********** */

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

/**
 * auth api request.
 * @param {Object} ctx 
 * @param {Function} next 
 */
let apiAuth = async (ctx, next) => {
    if (ctx.session.user) {
        await next();
    } else {
        ctx.throw(404, "用户或者密码错误");
    }
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
        await next();
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
    await ctx.render('layout.ejs');
}

module.exports = {
    apiAuth,
    validate,
    auth,
    renderLoginPage,
    renderAdminPage
}