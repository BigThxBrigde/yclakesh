const { services } = require('../dao/service')

/** ******** data query api *********** */

/**
 * validate user
 * @param {Object} ctx
 * @param {Function} next
 */
const validate = async (ctx, next) => {
  const params = ctx.request.body
  var result = await services.User.validate(params.name, params.password)
  if (result) {
    ctx.session.user = params.name
  }
  ctx.body = {
    success: result
  }
}

/**
 * Logout clean session
 * @param {*} ctx
 * @param {*} next
 */
const logout = async (ctx, next) => {
  ctx.session.user = null
  ctx.body = {
    success: true
  }
}

/**
 * auth api request.
 * @param {Object} ctx
 * @param {Function} next
 */
const apiAuth = async (ctx, next) => {
  if (ctx.session.user) {
    await next()
  } else {
    ctx.throw(404, '用户或者密码错误')
  }
}

/** ******** pages render api *********** */

/**
 * auth user, if not login redirect to /login
 * @param {Object} ctx
 * @param {Function} next
 */
const auth = async (ctx, next) => {
  if (!ctx.session.user) {
    ctx.redirect('/login')
  } else {
    await next()
  }
}

/**
 * redner login page
 * @param {Object} ctx
 * @param {Function} next
 */
const renderLoginPage = async (ctx, next) => {
  await ctx.render('login', { name: 'login' })
}

/**
 * rend admin page
 */
const renderAdminPage = async (ctx, next) => {
  await ctx.render('layout.ejs', { user: ctx.session.user })
}

module.exports = {
  apiAuth,
  validate,
  logout,
  auth,
  renderLoginPage,
  renderAdminPage
}
