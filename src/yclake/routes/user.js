const router = require('koa-router')()
const userController = require('../controller/user')
const loginController = require('../controller/login')

router.prefix('/user')

// render pages

router.post('/page/add', loginController.apiAuth, userController.renderAddPage)
router.post('/page/modify', loginController.apiAuth, userController.renderModifyPage)

// query data
router.post('/data/add', loginController.apiAuth, userController.add)
router.post('/data/updateData', loginController.apiAuth, userController.updateData)
router.post('/data/deleteData', loginController.apiAuth, userController.deleteData)
module.exports = router
