const loginController = require('../controller/login')

const router = require('koa-router')()

// if login, redirect to /admin
router.get('/', loginController.auth, loginController.renderAdminPage)

// redner admin page, if not login redirect to /login
router.get('/admin', loginController.apiAuth, loginController.renderAdminPage)

// redner login page
router.get('/login', loginController.renderLoginPage)

// validate login
router.post('/login', loginController.validate)

router.post('/logout', loginController.logout)

module.exports = router
