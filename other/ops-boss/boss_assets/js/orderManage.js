
var date = new getCurrentDate();
var inputDate = new getInputTime();//获取输入框中的日期

getOrderData();
getTicketQuantity(date._7daysago, date._1dayago);
getMoneyData(date._7daysago, date._1dayago);
getTicketFallData();
getCityDistributionData(0, 0, 1, -1);
getTicketTableData(1, 2, "boss/queryOrderListByTime", 'orderModal', '.b-Table', 0000000000000, new Date())

//点击订单编号
$('.b-Table').on('click','.order_num',function(){
    var order_id = $(this).attr('orderId');
    $.ajax({
        url: boss_url + "boss/queryOrderRelation",
        type: "post",
        contentType: "application/json",
        data:JSON.stringify({
            id:order_id
        }),
        success:function(res){
            if (res.httpStatus == 200) {
                $('.userid1').text(res.data.bossId);
                $('.mobile1').text(res.data.bossMobile);
                $('.userid2').text(res.data.modelId);
                $('.mobile2').text(res.data.modelMobile);
                if(res.data.modelType == 0){
                    $('.role2').text("c端");
                }else if(res.data.modelType == 1){
                    $('.role2').text("b端");
                }else if(res.data.modelType == 2){
                    $('.role2').text("中介");
                }
            }
        }
    })
})

//点击评价
$('.b-Table').on('click','.boss_evaluate',function(){
    var $Evaluate = $(this).attr('Evaluate');
    $('.evaluate').text($Evaluate)
})

//点击确定获取表格
$('.query_table').on('click', function () {
    var inputDate = new getInputTime();
    getTicketTableData(1, 2, "boss/queryOrderListByTime", 'orderModal', '.b-Table', inputDate._beginTime, inputDate._endTime)
})

//上一页
$('.b-Table').on('click','.previous',function(){
    var _inputDate = new getInputTime();
    var _PN = $('.currPn').text();
    _PN--;
    if(_PN < 1){
        _PN = 1;
        return false;
    }else{
        getTicketTableData(_PN, 2, "boss/queryOrderListByTime",'orderModal','.b-Table',_inputDate._beginTime, _inputDate._endTime)
    }
})

//下一页
$('.b-Table').on('click','.next',function(){
    var _inputDate = new getInputTime();
    var _PN = $('.currPn').text();
    var _pageCount = $('.totalPn').text();
    _PN++;
    if(_PN > _pageCount){
        _PN = _pageCount;
        return false;
    }else{
        getTicketTableData(_PN, 2, "boss/queryOrderListByTime",'orderModal','.b-Table',_inputDate._beginTime, _inputDate._endTime)
    }
})

//释放---同意
$('.b-Table').on('click','.agreeBtn',function(){
    var orderId = $(this).attr('orderId');
    var payStatus = $(this).attr('payStatus');
    agreeOrNot(orderId,payStatus);
})

//退款---同意
$('.b-Table').on('click', '.cancleBtn', function () {
    var orderId = $(this).attr('orderId');
    var payStatus = $(this).attr('payStatus');
    var _msg = "";
    agreeOrNot(orderId,payStatus,_msg);

})
//退款---不同意
$('.b-Table').on('click','.not_agree',function(){
    $('body #upload_noagree').attr('orderId',$(this).attr('orderId'))
})
//不同意模板的确定
$('body').on('click','#upload_noagree',function(){
    var orderId = $(this).attr('orderId');
    var payStatus = $(this).attr('payStatus');
    var _msg = $(this).parent().siblings().find('textarea').val();
    agreeOrNot(orderId,payStatus,_msg);
})

//下载表格
$('.pro-export').on('click',function(){
    window.location.href = boss_url + 'boss/exportExcelDepositList';
})

function agreeOrNot(id, payStatus, msg) {
    $.ajax({
        url: boss_url + "boss/updateReleaseAudit",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: id,
            payStatus: payStatus,
            msg: msg
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                alert("操作成功");
                window.location.reload();
            }else{
                alert(res.exception)
            }
        },
        error: function () { 
            alert('操作失败')
        }
    })
}

//订单管理概览
function getOrderData() {
    $.ajax({
        url: boss_url + "boss/queryOrderOverview",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "date": date._1dayago
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.orderNow').text(res.data.orderNow);
                $('.orderPriceNow').text(res.data.orderPriceNow/100);
                $('.orderCount').text(res.data.orderCount + '/' + res.data.orderRate + '%');
                $('.orderPriceCount').text(res.data.orderPriceCount/100);
                $('.singularCount').text(res.data.singularCount + '/' + res.data.returnRate + '%');
                $('.retained').text(res.data.retained/100);
            }
        },
        error: function () {
            console.log("订单管理概览请求出错！")
        }
    })
}

//订单个数走势图
function getTicketQuantity(beginTime, endTime) {
    var myChart = echarts.init(document.getElementById('mychart'));
    // 显示 Loading...
    myChart.showLoading();
    $.ajax({
        url: boss_url + "boss/allChartData",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            beginTime: beginTime,
            endTime: endTime
        }),
        success: function (res) {
            myChart.hideLoading();
            var Xdata = [];
            var Ydata = [];
            if (res.httpStatus == 200) {
                res.data.forEach(function (v, i) {
                    Xdata.push(v.date);
                    Ydata.push(v.orderNow);
                }, this);
                myChart.setOption({
                    title: {
                        text: '订单个数'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: '订单个数', textStyle: { color: '#009af9' } }]
                    },
                    color: ['#009af9'],
                    grid: {
                        left: '2%',
                        right: '4%',
                        bottom: '4%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: Xdata
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '订单个数',
                            type: 'line',
                            stack: '',
                            data: Ydata
                        }
                    ]
                });
            }
        },
        error: function () { }
    })
}

//订金流水
function getMoneyData(beginTime, endTime) {
    var myChart = echarts.init(document.getElementById('mychart2'));
    // 绘制图表
    myChart.showLoading();
    $.ajax({
        url: boss_url + "boss/allChartData",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            beginTime: beginTime,
            endTime: endTime
        }),
        success: function (res) {
            myChart.hideLoading();
            var Xdata = [];
            var Ydata = [];
            if (res.httpStatus == 200) {
                res.data.forEach(function (v, i) {
                    Xdata.push(v.date);
                    Ydata.push(v.orderPriceNow/100);
                }, this);
                myChart.setOption({
                    title: {
                        text: '订金流水'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: '订金流水', textStyle: { color: '#009af9' } }]
                    },
                    color: ['#009af9'],
                    grid: {
                        left: '2%',
                        right: '4%',
                        bottom: '4%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: Xdata
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '订金流水',
                            type: 'line',
                            stack: '',
                            data: Ydata
                        }
                    ]
                })
            }
        }
    })
}

//订金分布
function getTicketFallData() {
    var myChart = echarts.init(document.getElementById('mychart3'));
    // 显示 Loading...
    myChart.showLoading();
    $.ajax({
        url: boss_url + "boss/queryOrderDistributn",
        type: "post",
        contentType: "application/json",
        data: '{}',
        success: function (res) {
            myChart.hideLoading();
            var Xdata = [];
            var Ydata = [];
            if (res.httpStatus == 200) {
                res.data.forEach(function (v, i) {
                    Xdata.push(v.amount/100);
                    Ydata.push(v.count);
                }, this);
                myChart.setOption({
                    title: { text: '订金分布' },
                    tooltip: {},
                    xAxis: {
                        data: Xdata
                    },
                    yAxis: {},
                    series: [{
                        name: '',
                        type: 'bar',
                        data: Ydata
                    }]
                });
            }
        }
    })
}

//城市分布
function getCityDistributionData(zero, vipNum, orderNum, userType) {
    var myChart = echarts.init(document.getElementById('mychart4'));
    myChart.showLoading();
    $.ajax({
        url: boss_url + "boss/queryUserCityNum",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            zero: zero,
            vipNum: vipNum,
            orderNum: orderNum,
            userType: userType
        }),
        success: function (res) {
            myChart.hideLoading();
            if (res.httpStatus == 200) {
                var cityName = [];
                var dataArr = [];
                for (var k in res.data) {
                    cityName.push(k);
                    var _json = '{"value":' + res.data[k] + ',"name":"' + k + '"}'
                    dataArr.push(JSON.parse(_json))
                }
                myChart.setOption({
                    title: {
                        text: '城市分布',
                        subtext: '',
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: cityName
                    },
                    series: [
                        {
                            name: '城市占比',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: dataArr,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            }
        },
        error:function(){
            console.log('error');
        }
    })

}