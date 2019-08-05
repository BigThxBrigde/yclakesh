const router = require('koa-router')()

const index = require('./index')
const users = require('./user')
const identify = require('./identify')
const qrcode = require('./qrcode')
const tts = require('./tts')

router.use(index.routes(), index.allowedMethods())
router.use(users.routes(), users.allowedMethods())
router.use(identify.routes(), identify.allowedMethods())
router.use(qrcode.routes(), qrcode.allowedMethods())
router.use(tts.routes(), tts.allowedMethods())

module.exports = router
