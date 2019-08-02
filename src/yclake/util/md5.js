const crypto = require('crypto')

/**
 * md5 password
 * @param {String} password
 */
const MD5 = (password) => {
  var md5 = crypto.createHash('md5')
  return md5.update(password).digest('hex')
}

module.exports = {
  md5: MD5
}
