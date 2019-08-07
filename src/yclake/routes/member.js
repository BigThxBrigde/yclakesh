const router = require('koa-router')()
const memberController = require('../controller/member')
const loginController = require('../controller/login')

router.prefix('/member')

router.post('/page/add', loginController.apiAuth, memberController.renderAddPage)
router.post('/page/modify', loginController.apiAuth, memberController.renderModifyPage)
router.post('/data/add', loginController.apiAuth, memberController.add)
router.post('/data/find', loginController.apiAuth, memberController.find)
router.post('/data/updateData', loginController.apiAuth, memberController.updateData)
router.post('/data/deleteData', loginController.apiAuth, memberController.deleteData)
module.exports = router
