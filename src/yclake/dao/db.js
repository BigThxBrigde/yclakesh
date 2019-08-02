const mysql = require('mysql')
const config = require('../config.json')

const DB = (() => {
  const _ = {}

  // create a pool
  const _pool = mysql.createPool(config.dbconfig)

  /**
   * Create a query
   * @param {Object} options
   */
  const _query = (options) => {
    return new Promise((resolve, reject) => {
      _pool.getConnection(function (err, connection) {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          const sql = options.sql
          const params = options.params || []
          const useTrans = options.useTransaction || false

          if (!sql) {
            console.error('sql cannot be empty')
            reject(new Error('sql cannot be empty'))
          }

          if (useTrans) {
            connection.beginTransaction(err => {
              if (err) {
                console.error('sql cannot be empty')
                reject(err)
              } else {
                connection.query(sql, params, (err, rows) => {
                  if (err) {
                    console.error(err)
                    connection.rollback(() => {
                      console.error('rollback failed')
                    })
                    reject(err)
                  } else {
                    connection.commit((error) => {
                      if (error) {
                        console.error('commit failed')
                      }
                    })
                    resolve({
                      success: true,
                      data: rows
                    })
                  }
                  connection.release()
                })
              }
            })
          } else {
            connection.query(sql, params, (err, rows) => {
              if (err) {
                console.error(err)
                reject(err)
              } else {
                resolve({
                  success: true,
                  data: rows
                })
              }
              connection.release()
            })
          }
        }
      })
    })
  }
  _.query = _query
  return _
})()
/**
 * User info
 */
const UserInfo = (() => {
  const _ = {}
  /**
   * Find a record
   * @param {Object} options
   */
  const _find = async (options) => {
    const opt = options || {}
    const one = opt.one || false
    const filter = opt.filter
    const params = opt.params || []
    const useTransaction = opt.useTransaction || false
    const fields = opt.fields !== undefined ? opt.fields.join(',') : '*'
    const result = await DB.query({
      sql: `SELECT ${fields} FROM USER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    if (!result.success) {
      return {
        success: false,
        data: null
      }
    }
    const data = one ? (result.data.length === 0 ? null : result.data[0]) : result.data
    return {
      success: true,
      data: data
    }
  }
  /**
   * Add a record
   * @param {Object} options
   */
  const _add = async (options) => {
    const opt = options || {}
    const params = opt.params
    const useTransaction = opt.useTransaction || false
    if (params === undefined) {
      return
    }
    const result = await DB.query({
      sql: 'INSERT INTO USER_INFO (NAME, PASSWORD, TYPE) VALUES ?',
      params: [params],
      useTransaction: useTransaction
    })
    return result.success
  }

  /**
   * Update records
   * @param {Object} options
   */
  const _update = async (options) => {
    const opt = options || {}
    const update = opt.update
    const filter = opt.filter
    const params = opt.params || []
    const useTransaction = opt.useTransaction || false
    const result = await DB.query({
      sql: `UPDATE USER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    return result.success
  }

  /**
     * Delete a record
     * @param {Object} options
     */
  const _delete = async (options) => {
    const opt = options || {}
    const filter = opt.filter
    const params = opt.params
    const useTransaction = opt.useTransaction || false
    const result = await DB.query({
      sql: `DELETE FROM USER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    return result.success
  }
  _.add = _add
  _.find = _find
  _.update = _update
  _.delete = _delete
  return _
})()

const MemberInfo = (() => {
  const _ = {}

  /**
   * Find records
   * @param {*} options
   */
  const _find = async (options) => {
    const opt = options || {}
    const one = opt.one || false
    const filter = opt.filter
    const params = opt.params
    const useTransaction = opt.useTransaction || false
    const fields = opt.fields !== undefined ? opt.fields.join(',') : '*'
    const result = await DB.query({
      sql: `SELECT ${fields} FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    if (!result.success) {
      return {
        success: false,
        data: null
      }
    }
    const data = one ? (result.data.length === 0 ? null : result.data[0]) : result.data
    return {
      success: true,
      data: data
    }
  }

  /**
   * Add records
   * @param {Object} options
   */
  const _add = async (options) => {
    const opt = options || {}
    const params = opt.params || []
    const useTransaction = opt.useTransaction || false
    if (params === undefined) {
      return
    }
    const result = await DB.query({
      sql: 'INSERT INTO MEMBER_INFO (NAME, CERTIFICATION) VALUES ?',
      params: [params],
      useTransaction: useTransaction
    })
    return result.success
  }

  /**
   * Update records
   * @param {Object} options
   */
  const _update = async (options) => {
    const opt = options || {}
    const update = opt.update
    const filter = opt.filter
    const params = opt.params || []
    const useTransaction = opt.useTransaction || false
    const result = await DB.query({
      sql: `UPDATE MEMBER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    return result.success
  }

  /**
  * Delete records
  * @param {*} options
  */
  const _delete = async (options) => {
    const opt = options || {}
    const filter = opt.filter
    const params = opt.params || []
    const useTransaction = opt.useTransaction || false
    const result = await DB.query({
      sql: `DELETE FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    return result.success
  }

  _.find = _find
  _.add = _add
  _.update = _update
  _.delete = _delete

  return _
})()

const QRCodeInfo = (() => {
  /**  find record
     * option{
     *   filter: where expression,
     *   one: one recorder or list,
     *   params: filter params
     * }
     */
  const _ = {}
  const _find = async (options) => {
    const opt = options || {}
    const one = opt.one || false
    const filter = opt.filter
    const params = opt.params || []
    const useTransaction = opt.useTransaction || false
    const fields = opt.fields !== undefined ? opt.fields.join(',') : '*'
    const result = await DB.query({
      sql: `SELECT ${fields} FROM QRCODE_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    if (!result.success) {
      return {
        success: false,
        data: null
      }
    }
    const data = one ? (result.data.length === 0 ? null : result.data[0]) : result.data
    return {
      success: true,
      data: data
    }
  }

  /**
     * add records
     */
  const _add = async (options) => {
    const opt = options || {}
    const params = opt.params
    const useTransaction = opt.useTransaction || false
    if (params === undefined) {
      return false
    }
    const result = await DB.query({
      sql: 'INSERT INTO QRCODE_INFO (URL, SERIALID, IDENTIFYCODE, FIRSTTIME, QUERYCOUNT, MEMBER) VALUES ?',
      params: [params],
      useTransaction: useTransaction
    })
    return result.success
  }

  /**
     * update
     */
  const _update = async (options) => {
    const opt = options || {}
    const update = opt.update
    const filter = opt.filter
    const params = opt.params
    const useTransaction = opt.useTransaction || false
    const result = await DB.query({
      sql: `UPDATE QRCODE_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    return result.success
  }

  /**
     * delete
     */
  const _delete = async (options) => {
    const opt = options || {}
    const filter = opt.filter
    const params = opt.params
    const useTransaction = opt.useTransaction || false
    const result = await DB.query({
      sql: `DELETE FROM QRCODE_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
      params: params,
      useTransaction: useTransaction
    })
    return result.success
  }
  _.find = _find
  _.add = _add
  _.update = _update
  _.delete = _delete
  return _
})()

module.exports = {
  DB,
  UserInfo,
  MemberInfo,
  QRCodeInfo
}
