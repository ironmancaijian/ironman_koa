
var inputDate = new getInputTime();//获取输入框中的日期
var date = new getCurrentDate();

getBossData();
getBossChart(date._7daysago, date._1dayago);
getBossCityData(0, 0, 0, 1);
getUsersTableData(1, "", "boss/queryAllUserList", "bossListTemp", ".b-Table", 1, 20, "", 0000000000000, new Date())

//点击确定获取表格
$('.query_table').on('click', function () {
    var inputDate = new getInputTime();
    getUsersTableData(1, "", "boss/queryAllUserList", 'bossListTemp', '.b-Table', 1, 20, "", inputDate._beginTime, inputDate._endTime)
})
//上一页
$('.b-Table').on('click', '.previous', function () {
    var _inputDate = new getInputTime();
    var _PN = $('.currPn').text();
    var _desc = $('.b-Table').attr('desc');
    _PN--;
    if (_PN < 1) {
        _PN = 1;
        return false;
    } else {
        getUsersTableData(1, _desc, "boss/queryAllUserList", 'bossListTemp', '.b-Table', _PN, 20, "", inputDate._beginTime, inputDate._endTime)
    }
})
//下一页
$('.b-Table').on('click', '.next', function () {
    var _inputDate = new getInputTime();
    var _PN = $('.currPn').text();
    var _pageCount = $('.totalPn').text();
    var _desc = $('.b-Table').attr('desc');
    console.log()
    _PN++;
    if (_PN > _pageCount) {
        _PN = _pageCount;
        return false;
    } else {
        getUsersTableData(1, _desc, "boss/queryAllUserList", 'bossListTemp', '.b-Table', _PN, 20, "", inputDate._beginTime, inputDate._endTime)
    }
})
//点击排序----升序
$('.b-Table').on('dblclick','#sort',function(){
    var _desc = $(this).attr('mySort');    
    $('.b-Table').attr('desc',_desc)
    var inputDate = new getInputTime();    
    getUsersTableData(1, _desc, "boss/queryAllUserList", 'bossListTemp', '.b-Table', 1, 20, "", inputDate._beginTime, inputDate._endTime)
    
})
//点击排序----降序
$('.b-Table').on('click','#sort',function(){
    var _desc = $(this).attr('desc');    
    $('.b-Table').attr('desc',_desc)
    var inputDate = new getInputTime();
    getUsersTableData(1, _desc, "boss/queryAllUserList", 'bossListTemp', '.b-Table', 1, 20, "", inputDate._beginTime, inputDate._endTime)
})

//查询门票记录
$('.b-Table').on('click', '.boss_evaluate', function () {
    var _uid = $(this).attr('uid');
    var _type = $(this).attr('ordertype');
    console.log(_uid)
    queryOrderList(_uid, _type, -1,".ticketList")
})
//查询订单记录
$('.b-Table').on('click', '.order_evaluate', function () {
    var _uid = $(this).attr('uid');
    var _type = $(this).attr('ordertype');
    console.log(_uid)
    queryOrderList(_uid, _type, -1,".orderList")
})

//状态操作----禁用/解禁
$('.b-Table').on('click','.cancleBtn',function(){
    var _id = $(this).attr('userId');
    var _status = $(this).attr('status');
    $.ajax({
        url: boss_url + "boss/updateOpsUserBoss",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: _id,
            status:_status
        }),
        success:function(res){
            if (res.httpStatus == 200) {
                alert('操作成功');
                window.location.reload();
            }else{
                console.log(res.exception)
            }
        },
        error:function(){
            console.log('error')
        }
    })
})

//下载表格
$('.pro-export').on('click',function(){
    window.location.href = boss_url + 'boss/exportExcelBossUserList';
})

//BOSS概览
function getBossData() {
    $.ajax({
        url: boss_url + "boss/queryAddedNum",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "date": date._1dayago
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.boss').text(res.data.boss);
                $('.bossCount').text(res.data.bossCount);
            }else{
                console.log(res.exception);
            }
        },
        error: function () {
            console.log("BOSS概览请求出错！")
        }
    })
}


//BOSS数据走势图
function getBossChart(beginTime, endTime) {
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
            if (res.httpStatus == 200) {
                var BOSS = [];
                var xAxisData = [];
                for (var i = 0; i < res.data.length; i++) {
                    BOSS.push(res.data[i]['bossNew']);
                    xAxisData.push(res.data[i].date);
                }
                myChart.setOption({
                    title: {
                        text: 'BOSS数据'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: 'BOSS数据', textStyle: { color: '#009af9' } }]
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
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: 'BOSS数据',
                            type: 'line',
                            stack: '',
                            data: BOSS
                        }
                    ]
                });
            }else{
                console.log(res.exception)
            }
        },
        error: function () {
            console.log('error');
        }
    })
}

//城市分布
function getBossCityData(zero, vipNum, orderNum, userType) {
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
            }else{
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error')
        }
    })

}