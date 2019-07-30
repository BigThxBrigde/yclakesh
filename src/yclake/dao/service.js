const { Random } = require('../util/random');
const config = require('../config.json');
const { QRCodeInfo } = require('./db');
const { UserInfo } = require('./db');
const { MemberInfo } = require('./db');
const { md5 } = require('../util/md5');
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
             * @param {String} member 
             */
            let add = async (count, member) => {
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
                        member || null,
                        null,
                        null
                    ]);
                });
                if (rows.length == 0) {
                    return {
                        success: false
                    };
                }
                var result = await QRCodeInfo.add({
                    params: rows,
                    useTransaction: true
                });

                if (result) {
                    _saveCount(start + count);
                }
                return {
                    success: result,
                    nextSerialId: result ? Random.serialId({
                        prefix: config.random.prefix,
                        length: config.random.serialLength,
                        number: start + count
                    }) : ''
                };
            }


            let addBatch = async (count, number) => {
                let batchNumber = config.random.batchNumber;
                let raim = count % batchNumber;
                let part = parseInt(count / batchNumber, 10);

                let result = null;

                for (let index = 0; index < part; index++) {
                    result = await add(batchNumber, number);
                    if (!result.success) {
                        return {
                            success: false,
                            message: '批量插入失败',
                            nextSerialId: result.nextSerialId
                        }
                    }
                }
                if (raim > 0) {
                    result = await add(raim, number);
                    return {
                        success: result.success,
                        message: result.success ? '批量插入成功' : '批量插入失败',
                        nextSerialId: result.nextSerialId
                    }
                } else {
                    return {
                        success: true,
                        message: '批量插入成功',
                        nextSerialId: result.nextSerialId
                    }
                }
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

            let start = async () => Random.serialId({
                prefix: config.random.prefix,
                length: config.random.serialLength,
                number: _readCount()
            });
            qrcode.add = add;
            qrcode.find = find;
            qrcode.start = start;
            qrcode.addBatch = addBatch;
            return qrcode;
        })(),

        User: (() => {
            const User = {};

            /**
             * 
             * @param {name} name 
             * @param {password} password 
             */
            let add = async (name, password) => {
                password = md5(password);
                var result = await UserInfo.add({
                    params: [[name, password, 0]]
                });
                return result;
            };

            /**
             * 
             * @param {*} name 
             * @param {*} password 
             */
            let validate = async (name, password) => {
                password = md5(password);
                var result = await UserInfo.find({
                    one: true,
                    filter: ' NAME = ? AND PASSWORD = ?',
                    params: [name, password]
                });
                return result != null;
            }

            User.add = add;
            User.validate = validate;

            return User;
        })(),

        Member: (() => {
            const member = {};
            let find = async () => {
                let result = await MemberInfo.find();
                return result;
            };
            member.find = find;
            return member;
        })()
    }
}