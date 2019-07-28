const router = require('koa-router')();
const qrcodeController = require('../controller/qrcode');
const loginController = require('../controller/login');
router.prefix('/qrcode');

router.get('/', qrcodeController.renderPage, loginController.auth);

router.get('/query', qrcodeController.CSVExport);

module.exports = router
