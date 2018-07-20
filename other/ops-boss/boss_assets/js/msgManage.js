var phoneList = []
var phoneArr = [] //自定义id
var sendType = 1

function getUser (type) {
    $.ajax({
        url: boss_url + "boss/pushMobileByType",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            userType: type,
            cityId:-1,
            pn:1,
            pSize:999999999
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                phoneArr = res.data.list
                render()
            } else {
            
            }
        },
        error: function () {
            console.log('error');
        }
    })
}
getUser(sendType)
function check(data){
    if(data == 1){
        $('#tips').text('目前已选择全部boos')
        getUser(data)
    }
    if(data == 0){
        $('#tips').text('目前已选择全部佳人')
        getUser(data)
    }
    if(data == 2){
        $('#tips').text('目前已选择全部中介')
        getUser(data)
    }
    if(data == -1){
        $('#tips').text('')
        sendType = null
        phoneArr = []
        render()
        $('.btn-group>button').css({'background':'#fff','color':'#000'})
    }
    
}
function addConfirm(){
    var userid = $('#userid').val()
    phoneArr.push(userid)
    $('#userid').val('')
    render()
}

function del(i){
    phoneArr.splice(i,1)
    render()
}

function send(){//用户类型（0：c端，1：b端,2:中介 ）
    var msg = $("#pushmsg").val()
    if(msg==''){
        alert('内容不能为空')
        return
    }
    var url = 'boss/setSmsMessage'
    var commitData = {
        mobileList :phoneArr.join(','),
        sms:msg
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
    for(let i=0;i<phoneArr.length;i++){
        var str = "<div class='user_item'>"+
                        "<p>"+phoneArr[i]+"</p>"+
                        "<span onclick=del("+i+")>"+
                            "<i class='glyphicon glyphicon-trash'></i>"+
                        "</span>"+
                    "</div>"
        html+=str
    }
    $('#userItemBox').html(html)
}