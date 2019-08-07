const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const { log } = require('./util/log')
const session = require('koa-session')
const config = require('./config.json')
const router = require('./routes/router')
const path = require('path')
// error handler
onerror(app)

app.keys = config.appKeys
app.use(session(config.sessionConfig, app))

// middlewares
app.use(bodyparser({
  formLimit: '10mb',
  jsonLimit: '10mb',
  textLimit: '10mb',
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(path.join(__dirname, 'public')))

app.use(views(path.join(__dirname, 'views'), {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  log.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx)
  log.error('server error', err, ctx)
})

module.exports = app
