const router = require('koa-router')();
const qrcodeController = require('../controller/qrcode')

router.prefix('/qrcode');

router.get('/', qrcodeController.CSVExport);

module.exports = router
