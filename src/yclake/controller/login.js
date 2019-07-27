const { services } = require('../dao/service');

let auth = async (ctx, next) => {
    if (ctx.state.user) {
        ctx.redirect('/qrcode');
    } else {
        ctx.redirect('/login');
    }
}

let validate = async (ctx, next) => {
    let params = ctx.request.body;
    var result = await services.User.validate(params.name, params.password);
    if (result) {
        ctx.session = {
            name: params.name,
            login: true
        };
        ctx.state.user = params.name;
    }
}

let renderLogin = async (ctx, next) => {
    await ctx.render('login', { name: 'login' });
}

module.exports = {
    validate,
    auth,
    renderLogin
}