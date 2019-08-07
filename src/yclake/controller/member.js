const { services } = require('../dao/service')

const renderAddPage = async (ctx, next) => {
  await ctx.render('./layouts/modules/member', {
    operation: 'add'
  })
}

const add = async (ctx, next) => {
  const name = ctx.request.body.name
  const data = ctx.request.body.data
  if (!name) {
    ctx.throw(500, '会员名不能为空')
  }
  const none = await services.Member.none(name)
  if (!none) {
    ctx.body = {
      success: false,
      message: `已经存在用户名为${name}会员`
    }
  } else {
    const image = data === undefined ? null : Buffer.from(data, 'base64')
    const result = await services.Member.add(name, image)
    ctx.body = {
      success: result,
      message: `${result ? '添加会员成功' : '添加会员失败'}`
    }
  }
}

module.exports = {
  renderAddPage,
  add
}
