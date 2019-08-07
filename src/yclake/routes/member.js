const router = require('koa-router')()
const memberController = require('../controller/member')
const loginController = require('../controller/login')

router.prefix('/member')

router.post('/page/add', loginController.apiAuth, memberController.renderAddPage)

router.post('/data/add', loginController.apiAuth, memberController.add)

module.exports = router
