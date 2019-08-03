const router = require('koa-router')()
const ttsController = require('../controller/tts')

router.prefix('/tts')

router.post('/', ttsController.tts)

module.exports = router
