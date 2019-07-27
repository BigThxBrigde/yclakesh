const fs = require('fs');

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
        let stream = options.stream || fs.createWriteStream(file);
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
    export: exportCSV
};

module.exports = {
    CSV: CSV
}