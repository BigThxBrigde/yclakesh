const { services } = require('../dao/service');
const moment = require('moment');
const { CSV } = require('../util/csv');
const config = require('../config.json');

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
    if (!result.success || result.data == null || result.data.length == 0) {
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
    let result = await services.Member.find({ fields: ['name'] });
    let members = result.success ? ((result.data == null || result.data.length == 0) ? [] : result.data) : []
    await ctx.render('./layouts/modules/qrcode', {
        operation: 'generate',
        startSerialId: startSerialId,
        members: members
    });
}

const ERROR = -1, SUCCESS = 0, OVER_QUERY = 1, UNKNOWN = 2

let identify = async (ctx, next) => {
    let serialId = ctx.params.serialId;
    let code = ctx.params.code;
    let result = await services.QRCode.identify(serialId, code);
    if (!result.success) {
        await ctx.render('identify', {
            result: UNKNOWN
        });
    } else {
        if (result.data == null) {
            await ctx.render('identify', {
                result: ERROR,
                data: {
                    serialId: serialId,
                    code: code
                }
            });

        } else {

            let data = result.data;
            let queryCount = data.QueryCount || 0;
            let firstTime = data.firstTime || moment(Date.now()).format('yyyyMMddHHmmss')

            if (queryCount >= config.maxQueryCount) {
                await ctx.render('identify', {
                    result: OVER_QUERY,
                    data: {
                        serialId: serialId,
                        code: code,
                        queryCount: queryCount,
                        firstTime: firstTime,
                        member: member
                    }
                });
            } else {
                let r = await services.QRCode.update({
                    queryCount: queryCount + 1,
                    firstTime: moment(Date.now()).format('yyyyMMddHHmmssff'),
                    serialId: serialId,
                    identifyCode: code
                });
                if (!r) {
                    await ctx.render('identify', {
                        result: UNKNOWN
                    });
                } else {
                    await ctx.render('identify', {
                        result: SUCCESS,
                        data: {
                            serialId: serialId,
                            code: code,
                            queryCount: queryCount,
                            firstTime: firstTime,
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
    add,
    identify
}