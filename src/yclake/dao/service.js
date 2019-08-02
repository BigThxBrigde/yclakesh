const { Random } = require('../util/random')
const config = require('../config.json')
const { QRCodeInfo } = require('./db')
const { UserInfo } = require('./db')
const { MemberInfo } = require('./db')
const { md5 } = require('../util/md5')
module.exports = {
  services: {
    QRCode: (() => {
      const qrcode = {}

      /**
             * read count
             */
      const _readCount = () => {
        return require('./count.json').start
      }

      /**
             * user for save count
             * @param {Number} start
             */
      const _saveCount = (start) => {
        const count = require('./count.json')
        count.start = start
        const fs = require('fs')
        const path = require('path')
        fs.writeFileSync(path.join(__dirname, './count.json'), JSON.stringify(count))
      }

      /**
             *  @param {Number} count
             * @param {String} member
           */
      const add = async (count, member) => {
        const start = _readCount()
        const rows = []
        // serial id
        Random.serialId({
          prefix: config.random.prefix,
          length: config.random.serialLength,
          start: start,
          count: count
        }).forEach((serialId) => {
          const identiyCode = Random.randomCode({ length: config.random.identityCodeLength })
          const url = `${config.url}${serialId}/${identiyCode}`
          rows.push([
            url,
            serialId,
            identiyCode,
            member || null,
            null,
            null
          ])
        })
        if (rows.length === 0) {
          return {
            success: false
          }
        }
        const result = await QRCodeInfo.add({
          params: rows,
          useTransaction: true
        })

        if (result) {
          _saveCount(start + count)
        }
        return {
          success: result,
          nextSerialId: result ? Random.serialId({
            prefix: config.random.prefix,
            length: config.random.serialLength,
            number: start + count
          }) : ''
        }
      }

      const addBatch = async (count, number) => {
        const batchNumber = config.random.batchNumber
        const remain = count % batchNumber
        const part = parseInt(count / batchNumber, 10)

        let result = null

        for (let index = 0; index < part; index++) {
          result = await add(batchNumber, number)
          if (!result.success) {
            return {
              success: false,
              message: '批量插入失败',
              nextSerialId: result.nextSerialId
            }
          }
        }
        if (remain > 0) {
          result = await add(remain, number)
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
      const find = async (start, end) => {
        const startSerial = Random.serialId({
          prefix: config.random.prefix,
          length: config.random.serialLength,
          number: start
        })
        const endSerial = Random.serialId({
          prefix: config.random.prefix,
          length: config.random.serialLength,
          number: end
        })
        const result = await QRCodeInfo.find({
          filter: 'SERIALID BETWEEN ? and ?',
          params: [startSerial, endSerial]
        })
        return result
      }

      const start = async () => Random.serialId({
        prefix: config.random.prefix,
        length: config.random.serialLength,
        number: _readCount()
      })

      const update = async (options) => {
        const result = await QRCodeInfo.update({
          update: `SET queryCount = ? ${options.firstTime !== undefined ? ', firstTime = ?' : ''}`,
          filter: 'serialId = ? AND identifyCode = ?',
          params: [options.queryCount, options.firstTime, options.serialId, options.identifyCode]
        })
        return result
      }

      const identify = async (serialId, code) => {
        const result = await QRCodeInfo.find({
          one: true,
          filter: 'serialId= ? and identifyCode = ?',
          params: [serialId, code]
        })
        return result
      }

      qrcode.add = add
      qrcode.find = find
      qrcode.start = start
      qrcode.addBatch = addBatch
      qrcode.update = update
      qrcode.identify = identify
      return qrcode
    })(),

    User: (() => {
      const User = {}

      /**
                         *
                         * @param {name} name
                         * @param {password} password
                         */
      const add = async (name, password) => {
        password = md5(password)
        const result = await UserInfo.add({
          params: [[name, password, 0]]
        })
        return result
      }

      /**
                               *
                               * @param {*} name
                               * @param {*} password
                               */
      const validate = async (name, password) => {
        password = md5(password)
        const result = await UserInfo.find({
          one: true,
          filter: ' NAME = ? AND PASSWORD = ?',
          params: [name, password]
        })
        if (!result.success) {
          return false
        }
        return result.data != null
      }

      User.add = add
      User.validate = validate

      return User
    })(),

    Member: (() => {
      const member = {}
      const find = async () => {
        const result = await MemberInfo.find()
        return result
      }
      member.find = find
      return member
    })()
  }
}
