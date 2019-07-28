const { services } = require('../dao/service');

/**
 * auth user
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

let redirect = async (ctx, next) =>{
    ctx.redirect('/login');
}

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
 * redner login page
 * @param {Object} ctx 
 * @param {Function} next 
 */
let renderPage = async (ctx, next) => {
    await ctx.render('login', { name: 'login' });
}

let renderAdmin = async (ctx, next) =>{
    await next();
    await ctx.render('layout.ejs');
}

module.exports = {
    validate,
    auth,
    renderPage,
    redirect,
    renderAdmin
}