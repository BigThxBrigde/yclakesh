module.exports = {
  log: (() => {
    const log4js = require('log4js')
    const { logConfig } = require('./logConfig')
    log4js.configure(logConfig)
    const log = log4js.getLogger()
    return log
  })()
}
