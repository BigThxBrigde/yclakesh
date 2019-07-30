const { services } = require('../dao/service');
const moment = require('moment');
const { CSV } = require('../util/csv');
/**
 * /qrcode/query
 * @param {Object} ctx 
 * @param {Function} next 
 */
let CSVExport = async (ctx, next) => {
    // set header
    let fileName = `Exported_${moment(Date.now()).format('yyyyMMddHHmmss')}`;
    await ctx.res.setHeader('Content-disposition', `attachment; filename=` + encodeURIComponent(fileName) + '.csv');
    await ctx.res.writeHead(200, { 'Content-Type': 'text/csv;charset=utf-8' });

    let start = ctx.query.start;
    let end = ctx.query.end;
    var result = await services.QRCode.find(start, end);
    if (result == null || result.length == 0) {
        ctx.body = '导出错误，无存在数据或者服务器内部错误';
        ctx.res.status = 500;
        return;
    }
    let r = await CSV.export({
        data: result,
        fields: ['Url', 'SerialId', 'IdentifyCode'],
        stream: ctx.res
    })
};

/** data api */

/** 
 *  /qrcode/data/generate
*/
let add = async (ctx, next) => {
    let params = ctx.request.body;
    let result = await services.QRCode.add(parseInt(params.count, 10), params.member);
    if (result.success) {
        ctx.body = result
    } else {
        ctx.body = {
            success: false,
            message: '生成失败'
        }
    }
}

/********** pages render api *********** */
/**
 * Render generate pages
 * @param {Object} ctx 
 * @param {Function} next 
 */
let renderGeneratePage = async (ctx, next) => {
    let startSerialId = await services.QRCode.start();
    let members = await services.Member.find({ fields: ['name'] }) || [];
    await ctx.render('./layouts/modules/qrcode', {
        operation: 'generate',
        startSerialId: startSerialId,
        members: members
    });
}

module.exports = {
    CSVExport,
    renderGeneratePage,
    add
}