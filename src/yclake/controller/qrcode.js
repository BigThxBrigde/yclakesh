const { services } = require('../dao/service')
const moment = require('moment')
const { CSV } = require('../util/csv')
const config = require('../config.json')
const commerce = require('../commerce.json')
/**
 * /qrcode/query
 * @param {Object} ctx
 * @param {Function} next
 */
const CSVExport = async (ctx, next) => {
  // set header
  const fileName = `Exported_${moment(Date.now()).format('YYYYMMDDHHmmss')}`
  await ctx.res.setHeader('Content-disposition', `attachment; filename=` + encodeURIComponent(fileName) + '.csv')
  await ctx.res.writeHead(200, { 'Content-Type': 'text/csv;charset=utf-8' })

  const start = ctx.query.start
  const end = ctx.query.end
  var result = await services.QRCode.find(start, end)
  if (!result.success || result.data === null || result.data.length === 0) {
    ctx.body = '导出错误，无存在数据或者服务器内部错误'
    ctx.res.status = 500
    return
  }
  await CSV.export({
    data: result,
    fields: ['Url', 'SerialId', 'IdentifyCode'],
    stream: ctx.res
  })
}

/** data api */

/**
 *  /qrcode/data/generate
*/
const add = async (ctx, next) => {
  const params = ctx.request.body
  const result = await services.QRCode.addBatch(parseInt(params.count, 10), params.member === '' ? undefined : params.member)
  if (result.success) {
    ctx.body = result
  } else {
    ctx.throw(500, '生成失败')
  }
}

/**
 * Export data
 * @param {Object} ctx
 * @param {Function} next
 */
const exportData = async (ctx, next) => {
  // set header
  const fileName = `Exported_${moment(Date.now()).format('YYYYMMDDHHmmss')}`
  await ctx.res.setHeader('Content-disposition', `attachment; filename=` + encodeURIComponent(fileName) + '.csv')
  await ctx.res.writeHead(200, { 'Content-Type': 'text/csv;charset=utf-8' })

  const start = parseInt(ctx.query.start, 10)
  const end = parseInt(ctx.query.end, 10)
  const result = await CSV.export({
    start: start,
    end: end,
    fields: ['Url', 'SerialId', 'IdentifyCode'],
    stream: ctx.res
  })
  ctx.res.end()
  if (!result.success) {
    ctx.throw(500, '导出失败')
  }
}

const summary = async (ctx, next) => {
  const fileName = `Summary_${moment(Date.now()).format('YYYYMMDDHHmmss')}`
  await ctx.res.setHeader('Content-disposition', `attachment; filename=` + encodeURIComponent(fileName) + '.csv')
  await ctx.res.writeHead(200, { 'Content-Type': 'text/csv;charset=gb2312' })

  const start = !ctx.query.start ? parseInt(ctx.query.start, 10) : undefined
  const end = !ctx.query.end ? parseInt(ctx.query.end, 10) : undefined
  const result = await CSV.summary({
    start: start,
    end: end,
    stream: ctx.res,
    type: ctx.session.user.type
  })
  ctx.res.end()
  if (!result.success) {
    ctx.throw(500, '统计失败')
  }
}
/** ******** pages render api *********** */
/**
 * Render generate pages
 * @param {Object} ctx
 * @param {Function} next
 */
const renderGeneratePage = async (ctx, next) => {
  const startSerialId = await services.QRCode.start()
  const result = await services.Member.find({ fields: ['Name'] })
  const members = result.success ? ((result.data === null || result.data.length === 0) ? [] : result.data) : []
  await ctx.render('./layouts/modules/qrcode', {
    operation: 'generate',
    startSerialId: startSerialId,
    members: members
  })
}

/**
 * redner export page
 * @param {Object} ctx
 * @param {Function} next
 */
const renderExportPage = async (ctx, next) => {
  const options = ctx.session.user.type === 1 ? { fields: ['Name'] } : { fields: ['Name'], filter: ' type = ?', params: [1] }
  const result = await services.Member.find(options)
  const members = result.success ? ((result.data === null || result.data.length === 0) ? [] : result.data) : []
  await ctx.render('./layouts/modules/qrcode', {
    operation: 'export',
    members: members,
    user: ctx.session.user
  })
}

const renderModifyPage = async (ctx, next) => {
  const options = ctx.session.user.type === 1 ? { fields: ['Name'] } : { fields: ['Name'], filter: ' type = ?', params: [1] }
  const result = await services.Member.find(options)
  const members = result.success ? ((result.data === null || result.data.length === 0) ? [] : result.data) : []
  await ctx.render('./layouts/modules/qrcode', {
    operation: 'modify',
    members: members
  })
}

const renderConfigPage = async (ctx, next) => {
  await ctx.render('./layouts/modules/qrcode', {
    operation: 'config'
  })
}

const renderVideo = async (ctx, next) => {
  await ctx.render('video')
}

const ERROR = -1; const SUCCESS = 0; const OVER_QUERY = 1; const UNKNOWN = 2; const NOT_ASSOCIATED = 3

/**
 * identify
 * @param {Object} ctx
 * @param {Function} next
 */
const identify = async (ctx, next) => {
  const serialId = ctx.params.serialid
  const code = ctx.params.code
  const result = await services.QRCode.identify(serialId, code)
  if (!result.success) {
    await ctx.render('identify', {
      result: UNKNOWN,
      data: {}
    })
  } else {
    if (result.data == null) {
      await ctx.render('identify', {
        result: ERROR,
        data: {
          serialId: serialId,
          commerce: commerce,
          code: code
        }
      })
    } else {
      const data = result.data
      const queryCount = data.QueryCount || 1
      const d = data.FirstTime === null ? moment(Date.now()) : moment(data.FirstTime, 'YYYYMMDDHHmmss')
      const firstTime = data.FirstTime || d.format('YYYYMMDDHHmmss')
      const member = data.Member || ''

      if (member === '') {
        await ctx.render('identify', {
          result: NOT_ASSOCIATED,
          data: {}
        })
      } else {
        if (queryCount >= config.maxQueryCount) {
          const memberInfo = await _getMemberInfo(member)
          await ctx.render('identify', {
            result: OVER_QUERY,
            data: {
              serialId: serialId,
              code: code,
              queryCount: queryCount,
              commerce: commerce,
              firstTime: d.format('YYYY年M月D日 H时m分s秒'),
              info: memberInfo
            }
          })
        } else {
          const r = await services.QRCode.update({
            queryCount: queryCount + 1,
            firstTime: firstTime,
            serialId: serialId,
            identifyCode: code
          })
          if (!r) {
            await ctx.render('identify', {
              result: UNKNOWN
            })
          } else {
            const info = await _getMemberInfo(member)
            await ctx.render('identify', {
              result: SUCCESS,
              data: {
                serialId: serialId,
                code: code,
                queryCount: queryCount,
                firstTime: d.format('YYYY年M月D日 H时m分s秒'),
                member: member,
                commerce: commerce,
                info: info
              }
            })
          }
        }
      }
    }
  }
}

const _getMemberInfo = async (name) => {
  const result = await services.Member.find({
    filter: 'Name=?',
    params: [name],
    one: true
  })
  const data = result.success ? result.data : null
  if (data !== null) {
    return {
      name: data.Name,
      telephone: data.Telephone,
      page: data.Comment,
      certification: data.Certification ? `data:image/jpeg;base64,${Buffer.from(data.Certification, 'binary').toString('base64')}` : null,
      businessCertification: data.BusinessCertification ? `data:image/jpeg;base64,${Buffer.from(data.BusinessCertification, 'binary').toString('base64')}` : null,
      commCertification: data.CommCertification ? `data:image/jpeg;base64,${Buffer.from(data.CommCertification, 'binary').toString('base64')}` : null,
      logo: data.Logo ? `data:image/jpeg;base64,${Buffer.from(data.Logo, 'binary').toString('base64')}` : null,
      type: data.Type
    }
  } else {
    return {}
  }
}

const updateMember = async (ctx, next) => {
  const start = ctx.request.body.start
  const end = ctx.request.body.end
  const member = ctx.request.body.member

  if (ctx.session.user.type === 0) {
    // do check
    const r = await services.QRCode.checkNotNull(parseInt(start, 10), parseInt(end, 10))
    if (r) {
      ctx.body = {
        success: false,
        message: `${start} 到 ${end} 段中存在已经被关联过的数据, 如需重新关联，请联系管理员`
      }
      return
    }
  }

  const result = await services.QRCode.updateBatch(parseInt(start, 10), parseInt(end, 10), member)
  if (!result.success) {
    ctx.throw(500, '更新失败')
  } else {
    ctx.body = {
      success: result.success,
      meesage: result.message
    }
  }
}

const deleteData = async (ctx, next) => {
  const start = ctx.request.body.start
  const end = ctx.request.body.end
  const result = await services.QRCode.deleteData(parseInt(start, 10), parseInt(end, 10))
  if (result) {
    ctx.body = {
      success: true
    }
  } else {
    ctx.throw(500, '删除失败')
  }
}

const truncateData = async (ctx, next) => {
  const result = await services.QRCode.truncateData()
  if (result) {
    ctx.body = {
      success: true
    }
  } else {
    ctx.throw(500, '清空失败')
  }
}

const configData = async (ctx, next) => {
  const config = require('../config.json')
  const prefix = ctx.request.body.serialIdPrefix
  const serialIdLength = ctx.request.body.serialIdLength
  const codeLength = ctx.request.body.codeLength
  if (!prefix || !serialIdLength || !codeLength) {
    ctx.throw(500, '更新配置失败')
  } else {
    const _serialIdLength = parseInt(serialIdLength, 10) || 10
    const _codeLength = parseInt(serialIdLength, 10) || 10
    if (prefix.length + 5 >= _serialIdLength) {
      ctx.throw(500, '序列号过短')
    } else {
      try {
        config.random.prefix = prefix
        config.random.serialLength = _serialIdLength
        config.random.identityCodeLength = _codeLength
        const fs = require('fs')
        const path = require('path')
        fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify(config, null, 2))
        ctx.body = {
          success: true
        }
      } catch (e) {
        ctx.throw(500, '更新配置失败')
      }
    }
  }
}

module.exports = {
  CSVExport,
  renderGeneratePage,
  renderExportPage,
  renderModifyPage,
  renderConfigPage,
  renderVideo,
  add,
  identify,
  updateMember,
  deleteData,
  exportData,
  truncateData,
  configData,
  summary
}
