const router = require('koa-router')();
const qrcodeController = require('../controller/qrcode');
const loginController = require('../controller/login');

router.prefix('/qrcode');

router.get('/query', qrcodeController.CSVExport);

/***********  router for render pages **********/
router.post('/page/generate', loginController.apiAuth, qrcodeController.renderGeneratePage);

/** route for data * */
router.post('/data/generate', loginController.apiAuth, qrcodeController.add);

module.exports = router
