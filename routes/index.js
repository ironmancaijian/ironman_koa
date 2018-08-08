const router = require('koa-router')()
const mysql = require('mysql')
const {query} = require('../sql/sql')
const koa2Req = require('koa2-request')
const exec = require('child_process').exec

const mjs  = function(val){
  return JSON.stringify(val)
}
const mip = function(ip){
  let i = ip.split(':')
  return i[i.length-1]
}
const mbody = function(code=0,body={},msg='success'){
  return {
    code:code,
    data:body,
    msg:msg
  }
}
function addslashes(string) {
  return string.replace(/\\/g, '\\\\').
      replace(/\u0008/g, '\\b').
      replace(/\t/g, '\\t').
      replace(/\n/g, '\\n').
      replace(/\f/g, '\\f').
      replace(/\r/g, '\\r').
      replace(/'/g, '\\\'').
      replace(/"/g, '\\"');
}


async function selectAllData(sql) {
  // let sql = 'SELECT * FROM user'
  let dataList = await query( sql )
  return dataList
}

router.get('/', async (ctx, next) => {
  //  ctx.render('index',require('../public/index.html'))
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/user', async (ctx, next) => {
    ctx.body = {
      code:0,
      data:ctx.ip,
      msg:'success'
    }
})

router.get('/msgboard', async (ctx, next) => {
  let body = mbody(0)
  try{
     res = await selectAllData('select id,nick_name,message,create_time from msgboard WHERE art_id IS null ORDER BY create_time DESC')
     body = mbody(0,res)
  }catch(e){
    body = mbody(0,[],e)
  }
  
  ctx.body = body
})
router.post('/msgboard', async (ctx, next) => {
  let res;
  let art_id = ctx.request.body.art_id?ctx.request.body.art_id:null
  let sql = `INSERT INTO msgboard(art_id,nick_name,message,create_time,ip) VALUES (${art_id},"${ctx.request.body.nick_name}",'${ctx.request.body.message}',${mjs(new Date())},${mjs(mip(ctx.ip))});`
  try{
      await selectAllData(sql)
  }catch(e){
    await selectAllData(`CREATE TABLE IF NOT EXISTS  msgboard (
      id int(11) NOT NULL AUTO_INCREMENT,
      art_id int(11) DEFAULT NULL,
      nick_name varchar(100) DEFAULT NULL,
      message varchar(999) DEFAULT NULL,
      create_time varchar(40) DEFAULT NULL,
      ip varchar(40) DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`)
    await selectAllData(sql)
  }
  ctx.body = mbody(0)
})

router.get('/articleList',async(ctx,next) => {
  let body;
  try{
    let res = await selectAllData('SELECT id,title,create_at,view_count,short_intro from article')
    body = mbody(0,res.reverse())
  }catch(e){
    body = mbody(0,[])
  }
  ctx.body = body
})


router.get('/articleDetail/:id',async(ctx,next)=>{
  let body;
  try{
    let res = await selectAllData(`SELECT * FROM article WHERE id=${ctx.params.id}`)
    let comment = await selectAllData(`SELECT * FROM msgboard WHERE art_id=${ctx.params.id} ORDER BY create_time DESC`)
    let count = await selectAllData(`SELECT view_count FROM article WHERE id=${ctx.params.id}`)
    await selectAllData(`UPDATE article SET view_count=${++count[0].view_count} WHERE id=${ctx.params.id}`)
    res.forEach(item => {
      item.comment = comment
    });
    body = mbody(0,res[0])
  }catch(e){
    body = mbody(0,[],e)
  }
  ctx.body = body
})

router.patch('/article/:id',async (ctx,next)=>{
  let params = ctx.request.body
  let res = await selectAllData(`UPDATE article SET title='${params.title}',short_intro='${params.short_intro}',href='${params.href}',content='${addslashes(params.content)}' WHERE id=${ctx.params.id} `)
  ctx.body = mbody(0,{},res)
})

router.post('/article',async (ctx,next)=>{
  let params = ctx.request.body
  let res = await selectAllData(`INSERT INTO article (title,short_intro,href,content,create_at) VALUES ('${params.title}','${params.short_intro}','${params.href}','${addslashes(params.content)}',${mjs(new Date())})`)
  ctx.body = mbody(0,{},res)
})

router.delete('/article/:id',async(ctx,next)=>{
    let res = await selectAllData(`DELETE FROM article WHERE id=${ctx.params.id}`)
    ctx.body = mbody(0,{},res)
})

router.post('/backend',async(ctx,next)=>{
  exec('autopull.bat',function(err,sto,ste){
    err&&console.log(err)
  })
})
module.exports = router
