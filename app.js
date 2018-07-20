const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaCors = require('koa2-cors')

const index = require('./routes/index')
const users = require('./routes/users')
const weixin = require('./routes/weixin')


// 执行sql脚本对数据库进行读写 
// connection.query('SELECT * FROM user',  (error, results, fields) => {
//   if (error) throw error
//   // connected! 
//     console.log(results)
//   // 结束会话
// //   connection.release() 
// });

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/other/ops-boss'))
app.use(require('koa-static')(__dirname))
app.use(koaCors());

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(weixin.routes(), weixin.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
