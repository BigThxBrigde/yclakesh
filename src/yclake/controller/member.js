const { services } = require('../dao/service')

/**
 * Render add member page
 * @param {Object} ctx
 * @param {Function} next
 */
const renderAddPage = async (ctx, next) => {
  await ctx.render('./layouts/modules/member', {
    operation: 'add',
    user: ctx.session.user
  })
}

/**
 * Render modify member page
 * @param {Object} ctx
 * @param {Function} next
 */
const renderModifyPage = async (ctx, next) => {
  const options = ctx.session.user.type === 1 ? { fields: ['Name'] } : { fields: ['Name'], filter: ' type = ?', params: [1] }
  const result = await services.Member.find(options)
  const members = result.success ? ((result.data === null || result.data.length === 0) ? [] : result.data) : []
  await ctx.render('./layouts/modules/member', {
    operation: 'modify',
    members: members,
    user: ctx.session.user
  })
}

const add = async (ctx, next) => {
  const name = ctx.request.body.name
  const type = parseInt(ctx.request.body.type === undefined ? 1 : ctx.request.body.type, 10)
  const data = ctx.request.body.data || [[], [], [], []]
  const telephone = ctx.request.body.telephone
  const comment = ctx.request.body.comment
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
    const images = []
    data.forEach(e => {
      if (e.length > 0) {
        images.push(Buffer.from(e, 'base64'))
      } else {
        images.push(null)
      }
    })
    const result = await services.Member.add(name, type, telephone, comment, images)
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
      fields: ['Telephone', 'Certification', 'BusinessCertification', 'CommCertification', 'Comment', 'Type', 'Logo'],
      filter: 'Name=?',
      params: [name],
      one: true
    })
    const data = result.success ? result.data : null

    if (data !== null) {
      const r = {
        images: []
      }
      if (data.Telephone != null) {
        r.telephone = data.Telephone
      }
      if (data.Comment) {
        r.comment = data.Comment
      }
      r.type = data.Type
      if (data.Certification != null) {
        r.images.push(`data:image/jpeg;base64,${Buffer.from(data.Certification, 'binary').toString('base64')}`)
      } else {
        r.images.push(null)
      }
      if (data.BusinessCertification != null) {
        r.images.push(`data:image/jpeg;base64,${Buffer.from(data.BusinessCertification, 'binary').toString('base64')}`)
      } else {
        r.images.push(null)
      }
      if (data.CommCertification != null) {
        r.images.push(`data:image/jpeg;base64,${Buffer.from(data.CommCertification, 'binary').toString('base64')}`)
      } else {
        r.images.push(null)
      }
      if (data.Logo != null) {
        r.images.push(`data:image/jpeg;base64,${Buffer.from(data.Logo, 'binary').toString('base64')}`)
      } else {
        r.images.push(null)
      }

      ctx.body = {
        success: true,
        data: r
      }
    } else {
      ctx.body = {
        success: false,
        message: '没有找到数据'
      }
    }
  }
}

const updateData = async (ctx, next) => {
  const name = ctx.request.body.name
  const data = ctx.request.body.data || [[], [], [], []]
  const telephone = ctx.request.body.telephone
  const comment = ctx.request.body.comment
  if (!name && data.length === 0 && !telephone && !comment) {
    ctx.throw(500, '会员名或者图片或者电话不能为空')
  }

  const images = []
  data.forEach(e => {
    if (e.length > 0) {
      images.push(Buffer.from(e, 'base64'))
    } else {
      images.push(null)
    }
  })

  const result = await services.Member.updataData(name, telephone, comment, images)
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
