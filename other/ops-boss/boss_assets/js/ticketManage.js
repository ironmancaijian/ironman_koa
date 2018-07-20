var inputDate = new getInputTime();//获取输入框中的日期
var date = new getCurrentDate();
getTicketData();
getTicketQuantity(date._7daysago, date._1dayago);
getTicketFallData(date._7daysago, date._1dayago);
getCityDistributionData(0, 1,0,-1);
getTicketTableData(1,2,"boss/queryTicketList",'tabModal','.b-Table',0000000000000,new Date())

//点击确定获取表格
$('.query_table').on('click', function () {
    getTicketTableData(1, 2, "boss/queryTicketList",'tabModal','.b-Table',inputDate._beginTime, inputDate._endTime)
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
        getTicketTableData(_PN, 2, "boss/queryTicketList",'tabModal','.b-Table',_inputDate._beginTime, _inputDate._endTime)
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
        getTicketTableData(_PN, 2, "boss/queryTicketList",'tabModal','.b-Table',_inputDate._beginTime, _inputDate._endTime)
    }
})

//下载表格
$('.pro-export').on('click',function(){
    window.location.href = boss_url + 'boss/exportExcelTicketList';
})

//门票管理概览
function getTicketData() {
    $.ajax({
        url: boss_url + "boss/queryTicket",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "date": date._1dayago
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.ticketNow').text(res.data.ticketNow);
                $('.ticketCount').text(res.data.ticketCount);
                $('.ticketPriceCount').text(res.data.ticketPriceCount/100);
            }
        },
        error: function () {
            console.log("首页待处理事项请求出错！")
        }
    })
}

//门票个数走势图
function getTicketQuantity(beginTime, endTime) {
    var myChart = echarts.init(document.getElementById('mychart'));
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
                    Ydata.push(v.ticketNow);
                }, this);
                myChart.setOption({

                    title: {
                        text: '门票成交量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: '门票成交量', textStyle: { color: '#009af9' } }]
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
                            name: '门票成交量',
                            type: 'line',
                            stack: '',
                            data: Ydata
                        }
                    ]
                });
            }
        }
    })
}
//门票流水
function getTicketFallData(beginTime, endTime) {
    var myChart2 = echarts.init(document.getElementById('mychart2'));
    myChart2.showLoading();
    $.ajax({
        url: boss_url + "boss/allChartData",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            beginTime: beginTime,
            endTime: endTime
        }),
        success: function (res) {
            myChart2.hideLoading();
            var Xdata = [];
            var Ydata = [];
            if (res.httpStatus == 200) {
                res.data.forEach(function (v, i) {
                    Xdata.push(v.date);
                    Ydata.push(v.ticketPriceNow/100);
                }, this);
                myChart2.setOption({

                    title: {
                        text: '门票成交量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: '门票成交量', textStyle: { color: '#009af9' } }]
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
                            name: '门票成交量',
                            type: 'line',
                            stack: '',
                            data: Ydata
                        }
                    ]
                });
            }
        }
    })
}
//城市分布
function getCityDistributionData(zero, vipNum, orderNum, userType) {
    var myChart3 = echarts.init(document.getElementById('mychart3'));
    myChart3.showLoading();
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
            myChart3.hideLoading();
            if (res.httpStatus == 200) {
                var cityName = [];
                var dataArr = [];
                for (var k in res.data) {
                    cityName.push(k);
                    var _json = '{"value":' + res.data[k] + ',"name":"' + k + '"}'
                    dataArr.push(JSON.parse(_json))
                }
                myChart3.setOption({
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
        }
    })
}
