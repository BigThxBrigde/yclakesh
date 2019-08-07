const router = require('koa-router')()

const index = require('./index')
const user = require('./user')
const member = require('./member')
const identify = require('./identify')
const qrcode = require('./qrcode')
const tts = require('./tts')

router.use(index.routes(), index.allowedMethods())
router.use(user.routes(), user.allowedMethods())
router.use(identify.routes(), identify.allowedMethods())
router.use(qrcode.routes(), qrcode.allowedMethods())
router.use(tts.routes(), tts.allowedMethods())
router.use(member.routes(), member.allowedMethods())

module.exports = router
