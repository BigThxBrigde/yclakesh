const router = require('koa-router')()
const qrcodeController = require('../controller/qrcode')
const loginController = require('../controller/login')

router.prefix('/qrcode')

// router.get('/query', qrcodeController.CSVExport)

/** *********  router for render pages **********/
router.post('/page/generate', loginController.apiAuth, qrcodeController.renderGeneratePage)
router.post('/page/export', loginController.apiAuth, qrcodeController.renderExportPage)
router.post('/page/modify', loginController.apiAuth, qrcodeController.renderModifyPage)
router.post('/page/config', loginController.apiAuth, qrcodeController.renderConfigPage)
/** route for data * */
router.post('/data/generate', loginController.apiAuth, qrcodeController.add)
router.post('/data/updateMember', loginController.apiAuth, qrcodeController.updateMember)
router.get('/data/exportData', loginController.apiAuth, qrcodeController.exportData)
router.post('/data/deleteData', loginController.apiAuth, qrcodeController.deleteData)
router.post('/data/truncateData', loginController.apiAuth, qrcodeController.truncateData)
router.post('/data/configData', loginController.apiAuth, qrcodeController.configData)
router.get('/data/summary', loginController.apiAuth, qrcodeController.summary)

module.exports = router
