const { services } = require('../dao/service');

let validate = async (ctx, next) => {
    let params = ctx.params;
    var result = await services.User.validate(params.name, params.password);
    if (result) {
        ctx.session = {
            name: params.name,
            login: true
        };
        await next();
    }
}

module.exports = {
    validate
}