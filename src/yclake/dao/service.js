const { Random } = require('../util/random');
const config = require('../config.json');
const { QRCodeInfo } = require('./db');

module.exports = {
    services: {
        QRCode: (() => {
            const qrcode = {};

            /**
             * used for read count
             */
            let _readCount = () => {
                return require('./count.json').start;
            };

            /**
             * user for save count
             * @param {Number} start 
             */
            let _saveCount = (start) => {
                let count = require('./count.json');
                count.start = start;
                const fs = require('fs');
                const path = require('path');
                fs.writeFileSync(path.join(__dirname, './count.json'), JSON.stringify(count));
            }

            /**
             * 
             * @param {Number} count 
             */
            let add = async (count) => {
                let start = _readCount();
                let rows = [];
                // serial id
                Random.serialId({
                    prefix: config.random.prefix,
                    length: config.random.serialLength,
                    start: start,
                    count: count
                }).forEach(serialId => {
                    let identiyCode = Random.randomCode({ length: config.random.identityCodeLength });
                    let url = `${config.url}${serialId}/${identiyCode}`;
                    rows.push([
                        url,
                        serialId,
                        identiyCode,
                        null,
                        null,
                        null
                    ]);
                });
                if (rows.length == 0) {
                    return true;
                }
                var result = await QRCodeInfo.add({
                    params: rows,
                    useTransaction: true
                });

                if (result) {
                    _saveCount(start + count);
                }
                return result;
            }

            /**
             * find the data
             * @param {Number} start 
             * @param {Number} end 
             */
            let find = async (start, end) => {
                let startSerial = Random.serialId({
                    prefix: config.random.prefix,
                    length: config.random.serialLength,
                    number: start
                });
                let endSerial = Random.serialId({
                    prefix: config.random.prefix,
                    length: config.random.serialLength,
                    number: end
                });
                var result = await QRCodeInfo.find({
                    filter: 'SERIALID BETWEEN ? and ?',
                    params: [startSerial, endSerial]
                });
                return result;
            }

            qrcode.add = add;
            qrcode.find = find;
            return qrcode;
        })()
    }
}