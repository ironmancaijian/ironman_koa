const router = require('koa-router')()
const mysql = require('mysql')
const crypto = require('crypto')
const {query} = require('../sql/sql')
const jsSHA = require('jssha')
const koa2Req = require('koa2-request')
const mjs  = function(val){
  return JSON.stringify(val)
}
const mbody = function(code=0,body={},msg='success'){
  return {
    code:code,
    data:body,
    msg:msg
  }
}

async function selectAllData(sql) {
    // let sql = 'SELECT * FROM user'
    let dataList = await query( sql )
    return dataList
  }
var createNonceStr = function() {
    return Math.random().toString(36).substr(2, 15);
};

// timestamp
var createTimeStamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};
// 计算签名方法
var calcSignature = function (ticket, noncestr, ts, url) {
    var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
    shaObj = new jsSHA(str, 'TEXT');
    return shaObj.getHash('SHA-1', 'HEX');
}
router.get('/weixin',async (ctx, next)=>{
    var signature = ctx.query.signature;
    var timestamp = ctx.query.timestamp;
    var nonce = ctx.query.nonce;
    var echostr = ctx.query.echostr;
    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array('caijian',timestamp,nonce);
    array.sort();
    var str = array.toString().replace(/,/g,"");
  
    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");
    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        console.log('验证成功')
        ctx.body = echostr
    }else{
        console.log('验证失败')
        ctx.body = "error";
    }
  })
// var tokens = '11_3s1HAFXqERZzst5DnKyrvIB7G_SrqQi05hzVj3Kl-tzwBvRYgvEnRmJB47S8UrRr5hncd8Sn2C-88dtoRzOWcdUWRa3EDVIPekuYRmfFXE9Q7vAMijIG1miAYQ5avL0nfNmiUpVAZbA4Unc7ELYbABAPWJ'
let appId = 'wx75a662601d5776e9'
let appSecret = 'bcd7ca3f8d9b14d5abfadcad8c7a4783'
router.post('/weixin',async(ctx,next)=>{
    let access_token;
    try{
        let res = await selectAllData('SELECT * FROM weixin WHERE type="token"')
        if(new Date().getTime()/1000-res[0].create_at>7200){
            throw(new Error())
        }else{
            access_token = res[0].value
        }
    }catch(e){
        let tokenJson = await koa2Req.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`)
        let tokenObj = JSON.parse(tokenJson.body)
        await selectAllData(`CREATE TABLE IF NOT EXISTS  weixin (
            id int(11) NOT NULL AUTO_INCREMENT,
            type varchar(11) DEFAULT NULL,
            value varchar(999) DEFAULT NULL,
            create_at int(99) DEFAULT NULL,
            expired_in int(11) DEFAULT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8`)
        await selectAllData(`DELETE FROM weixin WHERE type='token'`)
        await selectAllData(`INSERT INTO weixin (type,value,create_at,expired_in) VALUES ('token','${tokenObj.access_token}',${new Date().getTime()/1000},${tokenObj.expires_in})`)
    }
    
    
    let ticket;
    let ticketRes =  await selectAllData('SELECT * FROM weixin WHERE type="ticket"')
    if((Array.isArray(ticketRes)&&ticketRes.length==0)||(Array.isArray(ticketRes)&&ticketRes.length!=0&&(new Date().getTime()/1000-ticketRes[0].create_at>7200))){
      let res = await koa2Req.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`)
      let ticketObj = JSON.parse(res.body)
      ticket = ticketObj.ticket
      await selectAllData(`INSERT INTO weixin (type,value,create_at,expired_in) VALUES ('ticket','${ticketObj.ticket}',${new Date().getTime()/1000},${ticketObj.expires_in})`)
    }else{
      ticket = ticketRes[0].value
    }
    let nonceStr = createNonceStr()
    let timeStamp = createTimeStamp()
    let signature = calcSignature(ticket,nonceStr,timeStamp,decodeURIComponent(ctx.request.body.url))
    let obj = {
        msg:'success',
        data:{
            appId:appId,
            timestamp:timeStamp,
            nonceStr:nonceStr,
            signature:signature,
            nonceStr:nonceStr,
            url:ctx.request.body.url,
            ticket:ticket,
            // realTicket:JSON.parse(tiketRes.body).ticket
            // access_token:JSON.parse(res.body).access_token
        },
        code:0
    }
    ctx.body = obj
})

module.exports = router