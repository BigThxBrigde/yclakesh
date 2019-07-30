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

            let start = async () => _readCount();
            qrcode.add = add;
            qrcode.find = find;
            qrcode.start = start;
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