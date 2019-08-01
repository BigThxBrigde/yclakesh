const router = require('koa-router')()

router.prefix('/identify')

router.get('/:serialid/:code', function (ctx, next) {
  ctx.body = ctx.params
})

module.exports = router
