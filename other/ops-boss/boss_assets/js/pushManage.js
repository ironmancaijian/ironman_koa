var phoneList = []

function getUser (type) {
    $.ajax({
        url: boss_url + "boss/queryAllUserList",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            type: type,
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                
                
            } else {
            
            }
        },
        error: function () {
            console.log('error');
        }
    })
}

var idsArr = [] //自定义id
var sendType = 1

function check(data){
    if(data == 1){
        $('#tips').text('目前已选择全部boos')
        sendType = data
        idsArr = []
        render()
    }
    if(data == 0){
        $('#tips').text('目前已选择全部佳人')
        sendType = data
        idsArr = []
        render()
    }
    if(data == 2){
        $('#tips').text('目前已选择全部中介')
        sendType = data
        idsArr = []
        render()
    }
    if(data == -1){
        $('#tips').text('')
        sendType = null
        $('.btn-group>button').css({'background':'#fff','color':'#000'})
    }
    
}
function addConfirm(){
    var userid = $('#userid').val()
    if(userid=='') return;
    idsArr.push(userid)
    $('#userid').val('')
    render()
}

function del(i){
    idsArr.splice(i,1)
    render()
}

function send(){//用户类型（0：c端，1：b端,2:中介 ）
    var msg = $("#pushmsg").val()
    if(msg==''){
        alert('内容不能为空')
        return
    }
    var url = '';
    var commitData = {};
    if(sendType == null){//自定id用户
        url = 'boss/pushById'
        commitData = {
            id:idsArr.join('|'),
            sms:msg
        }
    }else{
        url = 'boss/pushAll'
        commitData = {
            type:sendType,
            cityId:1,
            sms:msg
        }
    }
    $.ajax({
        url: boss_url+url,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(commitData),
        success: function (res) {
            if (res.httpStatus == 200) {
                alert('push成功')
            } else {
                alert(res.exception)
            }
        },
        error: function () {
            alert(res.exception)
            console.log('error');
        }
    })
}

function render(){
    var html = ''
    for(let i=0;i<idsArr.length;i++){
        var str = "<div class='user_item'>"+
                        "<p>"+idsArr[i]+"</p>"+
                        "<span onclick=del("+i+")>"+
                            "<i class='glyphicon glyphicon-trash'></i>"+
                        "</span>"+
                    "</div>"
        html+=str
    }
    $('#userItemBox').html(html)
}