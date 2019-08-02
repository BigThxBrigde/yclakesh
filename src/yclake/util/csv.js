const fs = require('fs')
const { services } = require('../dao/service')
const config = require('../config.json')
/**
 * Export csv
 * @param {Object} options
 */
const exportCSV = async (options) => {
  try {
    const data = options.data
    const fields = options.fields
    const delimiter = options.delimiter || ','
    const file = options.file
    const stream = options.stream || fs.createWriteStream(file, { flags: 'a' })
    data.forEach(row => {
      const line = _convert(row, fields).join(delimiter)
      stream.write(Buffer.from(`${line}\n`))
    })
    stream.end()
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

const exportData = async (options) => {
  try {
    const start = options.start
    const end = options.end

    const count = end - start + 1
    const batchNumber = config.random.batchNumber
    const remain = count % batchNumber
    const part = parseInt(count / batchNumber, 10)

    let r = null
    for (let index = 0; index < part; index++) {
      r = await writeLine({
        start: start + index * batchNumber,
        end: start + index * batchNumber + batchNumber - 1,
        fields: options.fields,
        delimiter: options.delimiter,
        file: options.file,
        stream: options.stream
      })
      if (!r.success) {
        return r
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
      })
    }
    return r
  } catch (e) {
    console.error(e)
    return {
      success: false,
      message: e.toString()
    }
  }
}

const writeLine = async (options) => {
  const start = options.start
  const end = options.end
  const fields = options.fields
  const delimiter = options.delimiter || ','
  const file = options.file
  const stream = options.stream || fs.createWriteStream(file, { flags: 'a' })

  const result = await services.QRCode.find(start, end)
  if (!result.success || result.data == null || result.data.length === 0) {
    return {
      success: false,
      message: '查询失败'
    }
  }

  result.data.forEach(row => {
    const line = _convert(row, fields).join(delimiter)
    stream.write(Buffer.from(`${line}\n`))
  })
  if (file !== undefined) {
    stream.end()
  }
  return {
    success: true,
    message: '导出成功'
  }
}

const _convert = (row, fields) => {
  const keys = Object.keys(row)
  var fields = fields || keys
  const values = []
  keys.filter(v => fields.includes(v))
    .forEach(e => {
      values.push(row[e])
    })
  return values
}

const CSV = {
  export: exportData
}

module.exports = {
  CSV: CSV
}
