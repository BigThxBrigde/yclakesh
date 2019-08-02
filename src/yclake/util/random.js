const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
const uuid = (length, radix) => {
  var uuid = []; var i
  radix = radix || chars.length

  if (length) {
    // Compact form
    for (i = 0; i < length; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

module.exports = {
  Random: (() => {
    const random = {}
    const contains = []

    /**
         * options
         * when number exists, generate one serialid,
         * else generate a serial id collection
         */
    random.serialId = (options) => {
      const prefix = options.prefix || ''
      const length = (options.length || 10) - prefix.length
      const number = options.number
      if (number !== undefined) {
        return `${prefix}${_pad(number, '0', length)}`
      }

      const start = options.start || 0
      const count = options.count || 100
      const result = []

      for (let index = start; index < start + count; index++) {
        result.push(`${prefix}${_pad(index, '0', length)}`)
      }

      return result
    }

    /**
         * generate non-duplicated code.
         */
    random.randomCode = (options) => {
      const length = options.length
      return `${_next(1, 9)}${uuid(length - 1, 10)}`
    }

    random.next = (min, max) => {
      while (true) {
        const rnd = _next(min, max)
        if (!contains.find((e, i) => e === rnd)) {
          contains.push(rnd)
          return rnd
        }
      }
    }

    const _next = (min, max) => {
      if (max === undefined) {
        return parseInt(Math.random() * min + 1, 10)
      }
      return parseInt(Math.random() * (max - min + 1) + min, 10)
    }

    const _pad = (num, padChar, length) => {
      return `${Array.apply(null, { length: length }).fill(padChar).join('') + num}`.slice(-length)
    }
    return random
  })()
}
