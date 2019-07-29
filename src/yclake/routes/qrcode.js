const router = require('koa-router')();
const qrcodeController = require('../controller/qrcode');
const loginController = require('../controller/login');

router.prefix('/qrcode');

router.get('/query', qrcodeController.CSVExport);

router.post('/page/generate', loginController.apiAuth, qrcodeController.renderGeneratePage);


module.exports = router
