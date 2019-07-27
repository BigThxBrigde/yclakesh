const router = require('koa-router')()

router.prefix('/identify')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/:serialid/:code', function (ctx, next) {
  ctx.body = ctx.params
})

module.exports = router
