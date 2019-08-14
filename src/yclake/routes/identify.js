const router = require('koa-router')()
const qrcodeController = require('../controller/qrcode')
router.prefix('/identify')

router.get('/:serialid/:code', qrcodeController.identify)
router.get('/video', qrcodeController.renderVideo)

module.exports = router
