const { Random } = require('../util/random')
const config = require('../config.json')
const { QRCodeInfo } = require('./db')
const { UserInfo } = require('./db')
const { MemberInfo } = require('./db')
const { md5 } = require('../util/md5')
const { DB } = require('./db')
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
       *  user for save count
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
            null,
            null,
            member || null
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

      /**
       * Add batch qrcode
       * @param {Number} count
       * @param {String} member
       */
      const addBatch = async (count, member) => {
        const batchNumber = config.random.batchNumber
        const remain = count % batchNumber
        const part = parseInt(count / batchNumber, 10)

        let result = null

        for (let index = 0; index < part; index++) {
          result = await add(batchNumber, member)
          if (!result.success) {
            return {
              success: false,
              message: '批量插入失败',
              nextSerialId: result.nextSerialId
            }
          }
        }
        if (remain > 0) {
          result = await add(remain, member)
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
       *  find the data
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

      const checkNotNull = async (start, end) => {
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
        const sql = 'SELECT COUNT(1) as count FROM QRCODE_INFO WHERE SERIALID BETWEEN ? and ? and member is not null'
        const result = await DB.query({
          sql: sql,
          params: [startSerial, endSerial]
        })
        if (result.success) {
          return result.data[0].count > 0
        } else {
          return true
        }
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

      /**
       * Update batch ( only update member)
       */
      const updateBatch = async (start, end, member) => {
        const count = end - start + 1
        const batchNumber = config.random.batchNumber
        const remain = count % batchNumber
        const part = parseInt(count / batchNumber, 10)

        let result = false
        for (let index = 0; index < part; index++) {
          const startSerial = Random.serialId({
            prefix: config.random.prefix,
            length: config.random.serialLength,
            number: start + index * batchNumber
          })
          const endSerial = Random.serialId({
            prefix: config.random.prefix,
            length: config.random.serialLength,
            number: start + index * batchNumber + batchNumber - 1
          })
          result = await QRCodeInfo.update({
            update: 'SET member = ? ',
            filter: 'serialId BETWEEN ? AND ?',
            params: [member, startSerial, endSerial],
            useTransaction: true
          })
          if (!result) {
            return {
              success: false,
              message: '更新失败'
            }
          }
        }
        if (remain > 0) {
          const startSerial = Random.serialId({
            prefix: config.random.prefix,
            length: config.random.serialLength,
            number: end - remain + 1
          })
          const endSerial = Random.serialId({
            prefix: config.random.prefix,
            length: config.random.serialLength,
            number: end
          })
          result = await QRCodeInfo.update({
            update: 'SET member = ? ',
            filter: 'serialId BETWEEN ? AND ?',
            params: [member, startSerial, endSerial],
            useTransaction: true
          })
          if (!result) {
            return {
              success: false,
              message: '更新失败'
            }
          } else {
            return {
              success: true,
              message: '批量更新成功'
            }
          }
        } else {
          return {
            success: true,
            message: '批量更新成功'
          }
        }
      }

      const identify = async (serialId, code) => {
        const result = await QRCodeInfo.find({
          one: true,
          filter: 'serialId= ? and identifyCode = ?',
          params: [serialId, code]
        })
        return result
      }

      const deleteData = async (start, end) => {
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
        const result = await QRCodeInfo.delete({
          filter: 'serialId BETWEEN ? AND ?',
          params: [startSerial, endSerial],
          useTransaction: true
        })
        return result
      }

      const truncateData = async () => {
        const result = await DB.query({ sql: 'TRUNCATE TABLE QRCODE_INFO' })
        return result.success
      }
      qrcode.add = add
      qrcode.find = find
      qrcode.start = start
      qrcode.addBatch = addBatch
      qrcode.update = update
      qrcode.updateBatch = updateBatch
      qrcode.identify = identify
      qrcode.deleteData = deleteData
      qrcode.truncateData = truncateData
      qrcode.checkNotNull = checkNotNull

      return qrcode
    })(),

    User: (() => {
      const User = {}

      const find = async () => {
        const result = await UserInfo.find({
          filter: ' name <> ? ',
          params: ['admin']
        })
        if (result.success) {
          return result.data
        } else {
          return []
        }
      }
      /**
       *
        * @param {name} name
       * @param {password} password
      * */
      const add = async (name, password) => {
        password = md5(password)
        const result = await UserInfo.add({
          params: [[name, password, 0]]
        })
        return result
      }

      const none = async (name) => {
        const result = await UserInfo.find({
          filter: ' name = ? ',
          params: [name],
          one: true
        })
        if (result.success) {
          return result.data === null
        } else {
          return false
        }
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
        return result
      }

      const updatePassword = async (name, password) => {
        password = md5(password)
        const result = await UserInfo.update({
          update: 'SET PASSWORD=?',
          filter: ' NAME=?',
          params: [password, name]
        })
        return result
      }

      const deleteData = async (name) => {
        const result = await UserInfo.delete({
          filter: ' NAME = ? ',
          params: [name]
        })
        return result
      }

      User.add = add
      User.validate = validate
      User.none = none
      User.find = find
      User.updatePassword = updatePassword
      User.deleteData = deleteData

      return User
    })(),

    Member: (() => {
      const member = {}
      const find = async (options) => {
        const result = await MemberInfo.find(options)
        return result
      }

      const none = async (name) => {
        const result = await MemberInfo.find({
          filter: ' name = ? ',
          params: [name],
          one: true
        })
        if (result.success) {
          return result.data === null
        } else {
          return false
        }
      }
      const add = async (name, type, telephone, comment, images) => {
        const brandCert = images[0] || null
        const businessCert = images[1] || null
        const commCert = images[2] || null
        const logo = images[3] || null

        const result = await MemberInfo.add({
          params: {
            Name: name,
            Telephone: telephone || null,
            Certification: brandCert,
            BusinessCertification: businessCert,
            CommCertification: commCert,
            Comment: comment || null,
            Logo: logo,
            Type: type === undefined ? 1 : type
          }
        })
        return result
      }

      const updataData = async (name, telephone, comment, images) => {
        const updateParts = []
        const params = []
        if (telephone) {
          updateParts.push('Telephone=?')
          params.push(telephone)
        }
        if (comment) {
          updateParts.push('Comment=?')
          params.push(comment)
        }
        if (images[0]) {
          updateParts.push('Certification=?')
          params.push(images[0])
        }

        if (images[1]) {
          updateParts.push('BusinessCertification=?')
          params.push(images[1])
        }
        if (images[2]) {
          updateParts.push('CommCertification=?')
          params.push(images[2])
        }
        if (images[3]) {
          updateParts.push('Logo=?')
          params.push(images[3])
        }
        if (updateParts.length === 0) {
          return false
        }
        const updatePart = `SET ${updateParts.join(',')}`
        params.push(name)
        const result = await MemberInfo.update({
          update: updatePart,
          filter: 'name = ?',
          params: params
        })
        return result
      }

      const deleteData = async (name) => {
        const result = await MemberInfo.delete({
          filter: ' Name = ?',
          params: [name]
        })
        return result
      }

      member.find = find
      member.none = none
      member.add = add
      member.updataData = updataData
      member.deleteData = deleteData

      return member
    })()
  }
}
