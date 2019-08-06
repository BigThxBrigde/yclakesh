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

const updateData = async (ctx, next) => {
  const userName = ctx.request.body.userName
  const password = ctx.request.body.password
  if (!userName || !password) {
    ctx.throw(500, '用户名或者密码为空')
  }
  const result = await services.User.updatePassword(userName, password)
  ctx.body = {
    success: result,
    message: result ? '更新密码成功' : '更新密码失败'
  }
}

const deleteData = async (ctx, next) => {
  const userName = ctx.request.body.userName
  if (!userName) {
    ctx.throw(500, '用户名不能为空')
  }
  const result = await services.User.deleteData(userName)
  ctx.body = {
    success: result,
    message: result ? '删除成功' : '删除失败'
  }
}

module.exports = {
  add,
  updateData,
  deleteData,
  renderAddPage,
  renderModifyPage
}
