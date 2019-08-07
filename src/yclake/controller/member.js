const { services } = require('../dao/service')

const renderAddPage = async (ctx, next) => {
  await ctx.render('./layouts/modules/member', {
    operation: 'add'
  })
}

const renderModifyPage = async (ctx, next) => {
  const result = await services.Member.find({ fields: ['Name'] })
  const members = result.success ? ((result.data === null || result.data.length === 0) ? [] : result.data) : []
  await ctx.render('./layouts/modules/member', {
    operation: 'modify',
    members: members
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

const find = async (ctx, next) => {
  const name = ctx.request.body.name
  if (!name) {
    ctx.body = {
      success: false,
      message: '缺少会员名'
    }
  } else {
    const result = await services.Member.find({
      fields: ['Certification'],
      filter: 'Name=?',
      params: [name],
      one: true
    })
    const data = result.success ? result.data : null
    if (data.Certification !== null) {
      const buf = Buffer.from(data.Certification, 'binary')
      ctx.body = {
        success: true,
        data: `data:image/jpeg;base64,${buf.toString('base64')}`
      }
    } else {
      ctx.body = {
        success: false,
        message: '没有找到图片'
      }
    }
  }
}

const updateData = async (ctx, next) => {
  const name = ctx.request.body.name
  const data = ctx.request.body.data
  if (!name || !data) {
    ctx.throw(500, '会员名或者图片不能为空')
  }

  const image = data === undefined ? null : Buffer.from(data, 'base64')
  const result = await services.Member.updataData(name, image)
  ctx.body = {
    success: result,
    message: `${result ? '更新会员成功' : '更新会员失败'}`
  }
}

const deleteData = async (ctx, next) => {
  const name = ctx.request.body.name
  if (!name) {
    ctx.throw(500, '会员名不能为空')
  }
  const result = await services.Member.deleteData(name)
  ctx.body = {
    success: result,
    message: `${result ? '删除会员成功' : '删除会员失败'}`
  }
}

module.exports = {
  renderAddPage,
  renderModifyPage,
  add,
  find,
  updateData,
  deleteData
}
