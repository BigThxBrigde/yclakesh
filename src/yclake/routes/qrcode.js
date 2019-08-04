const router = require('koa-router')()
const qrcodeController = require('../controller/qrcode')
const loginController = require('../controller/login')

router.prefix('/qrcode')

router.get('/query', qrcodeController.CSVExport)

/** *********  router for render pages **********/
router.post('/page/generate', loginController.apiAuth, qrcodeController.renderGeneratePage)
router.post('/page/export', loginController.apiAuth, qrcodeController.renderExportPage)

/** route for data * */
router.post('/data/generate', loginController.apiAuth, qrcodeController.add)

module.exports = router
