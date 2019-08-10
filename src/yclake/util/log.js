
const log4js = require('log4js')
const { logConfig } = require('./logConfig')
log4js.configure(logConfig)

module.exports = {
  log: (() => log4js.getLogger())(),
  accessLog: (() => log4js.getLogger('access'))()
}
