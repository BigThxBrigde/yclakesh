const { services } = require('../dao/service')

const renderAddPage = async (ctx, next) => {
  await ctx.render('./layouts/modules/user', {
    operation: 'add'
  })
}

const renderModifyPage = async (ctx, next) => {
  const users = await services.User.find()
  await ctx.render('./layouts/modules/user', {
    operation: 'modify',
    users: users
  })
}

const add = async (ctx, next) => {
  const userName = ctx.request.body.userName
  const password = ctx.request.body.password
  if (!userName || !password) {
    ctx.throw(500, '用户名或者密码为空')
  }
  const none = await services.User.none(userName)
  if (!none) {
    ctx.body = {
      success: false,
      message: `已经存在用户名为${userName}的用户`
    }
  } else {
    const result = await services.User.add(userName, password)
    ctx.body = {
      success: result,
      message: `${result ? '添加新用户成功' : '添加新用户失败'}`
    }
  }
}

module.exports = {
  add,
  renderAddPage,
  renderModifyPage
}
