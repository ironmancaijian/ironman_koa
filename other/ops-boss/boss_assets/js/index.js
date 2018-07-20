
var date = new getCurrentDate();

getIndexCurrentData();
getTodoList();


//累计数据概览 今日数据概览
function getIndexCurrentData(){
    $.ajax({
        url:boss_url+"boss/queryPageOverview",
        type:"post",
        contentType:"application/json",
        data:JSON.stringify({
            "date":date._1dayago
        }),
        success:function(res){
            if(res.httpStatus == 200){
                $('.countUserTotal').text(res.data.countUserTotal);
                $('.ticketNumTotal').text(res.data.ticketNumTotal);
                $('.orderNumTotal').text(res.data.orderNumTotal);
                $('.orderCountTotal').text(res.data.orderCountTotal/100);
                $('.countUser').text(res.data.countUser);
                $('.ticketNum').text(res.data.ticketNum);
                $('.orderNum').text(res.data.orderNum);
                $('.orderCount').text(res.data.orderCount/100);
            }else{
                alert(res.exception);
            }
        },
        error:function(res){
            console.log("首页数据请求出错！");
        }
    })
}

//待处理事项
function getTodoList(){
    $.ajax({
        url:boss_url+"boss/queryPendingItems",
        type:"post",
        contentType:"application/json",
        data:JSON.stringify({
            "userStatus":0,
            "orderStatus":0
        }),
        success:function(res){
            if(res.httpStatus == 200){
                $('.modelNum').text(res.data.modelNum);
                $('.agencyModelNum').text(res.data.agencyModelNum);
                $('.orderNum1').text(res.data.orderNum);
            }
        },
        error:function(){
            console.log("首页待处理事项请求出错！")
        }
    })
}