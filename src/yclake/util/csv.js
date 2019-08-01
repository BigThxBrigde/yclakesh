const fs = require('fs');
const { services } = require('../dao/service');
const config = require('../config.json');
/**
 * Export csv
 * @param {Object} options 
 */
let exportCSV = async (options) => {
    try {
        let data = options.data;
        let fields = options.fields;
        let delimiter = options.delimiter || ',';
        let file = options.file;
        let stream = options.stream || fs.createWriteStream(file, { flags: 'a' });
        data.forEach(row => {
            let line = _convert(row, fields).join(delimiter);
            stream.write(Buffer.from(`${line}\n`));
        });
        stream.end();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

let exportData = async (options) => {
    try {

        let start = options.start;
        let end = options.end;

        let count = end - start + 1;
        let batchNumber = config.random.batchNumber;
        let remain = count % batchNumber;
        let part = parseInt(count / batchNumber, 10);

        let r = null;
        for (let index = 0; index < part; index++) {
            r = await writeLine({
                start: start + index * batchNumber,
                end: start + index * batchNumber + batchNumber - 1,
                fields: options.fields,
                delimiter: options.delimiter,
                file: options.file,
                stream: options.stream
            });
            if (!r.success) {
                return r;
            }
        }

        if (remain > 0) {
            r = await writeLine({
                start: end - remain + 1,
                end: end,
                fields: options.fields,
                delimiter: options.delimiter,
                file: options.file,
                stream: options.stream
            });
        }
        return r;
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: e.toString()
        };
    }
}

let writeLine = async (options) => {

    let start = options.start;
    let end = options.end;
    let fields = options.fields;
    let delimiter = options.delimiter || ',';
    let file = options.file;
    let stream = options.stream || fs.createWriteStream(file, { flags: 'a' });

    let result = await services.QRCode.find(start, end);
    if (!result.success || result.data == null || result.data.length === 0) {
        return {
            success: false,
            message: '查询失败'
        }
    }

    result.data.forEach(row => {
        let line = _convert(row, fields).join(delimiter);
        stream.write(Buffer.from(`${line}\n`));
    });
    if (file !== undefined) {
        stream.end();
    }
    return {
        success: true,
        message: '导出成功'
    };
}

let _convert = (row, fields) => {
    let keys = Object.keys(row);
    var fields = fields || keys;
    let values = [];
    keys.filter(v => fields.includes(v))
        .forEach(e => {
            values.push(row[e]);
        });
    return values;
}

const CSV = {
    export: exportData
};

module.exports = {
    CSV: CSV
}