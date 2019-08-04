const { services } = require('../dao/service')
const moment = require('moment')
const { CSV } = require('../util/csv')
const config = require('../config.json')

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
    ctx.body = {
      success: false,
      message: '生成失败'
    }
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
  const result = await services.Member.find({ fields: ['name'] })
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

}

const ERROR = -1; const SUCCESS = 0; const OVER_QUERY = 1; const UNKNOWN = 2

const identify = async (ctx, next) => {
  const serialId = ctx.params.serialid
  const code = ctx.params.code
  const result = await services.QRCode.identify(serialId, code)
  if (!result.success) {
    await ctx.render('identify', {
      result: UNKNOWN
    })
  } else {
    if (result.data == null) {
      await ctx.render('identify', {
        result: ERROR,
        data: {
          serialId: serialId,
          code: code
        }
      })
    } else {
      const data = result.data
      const queryCount = data.QueryCount || 0
      const d = data.FirstTime === null ? moment(Date.now()) : moment(data.FirstTime, 'YYYYMMDDHHmmss')
      const firstTime = data.FirstTime || d.format('YYYYMMDDHHmmss')
      const member = data.Member || ''

      if (queryCount >= config.maxQueryCount) {
        await ctx.render('identify', {
          result: OVER_QUERY,
          data: {
            serialId: serialId,
            code: code,
            queryCount: queryCount,
            firstTime: d.format('YYYY年M月D日 H时m分s秒')
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
          await ctx.render('identify', {
            result: SUCCESS,
            data: {
              serialId: serialId,
              code: code,
              queryCount: queryCount,
              firstTime: d.format('YYYY年M月D日 H时m分s秒'),
              member: member
            }
          })
        }
      }
    }
  }
}

module.exports = {
  CSVExport,
  renderGeneratePage,
  renderExportPage,
  add,
  identify
}
