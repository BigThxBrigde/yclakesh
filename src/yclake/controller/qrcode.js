const { services } = require('../dao/service');
const moment = require('moment');
const { CSV } = require('../util/csv');
const { isOnline } = require('./login');
/**
 * /qrcode/query -> POST
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

/********** pages render api *********** */
/**
 * Render generate pages
 * @param {Object} ctx 
 * @param {Function} next 
 */
let renderGeneratePage = async (ctx, next) => {
    let startSerialId = await services.QRCode.start();
    let members = await services.Member.find({fields:['name']}) || [];
    await ctx.render('./layouts/modules/qrcode', {
        operation: 'generate',
        startSerialId: startSerialId,
        members : members
    });
}

module.exports = {
    CSVExport,
    renderGeneratePage
}