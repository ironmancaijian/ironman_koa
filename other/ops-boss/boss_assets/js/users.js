
var date = new getCurrentDate();
var inputDate = new getInputTime();//获取输入框中的日期

getUsersData();
getNewUserChart(date._7daysago, date._1dayago);
getCityData(0, 0, 0, -1);
getUsersTableData(-1, "", "boss/queryAllUserList", "allUsersModal", ".b-Table", 1, 3, "", 0000000000000, new Date())

//点击确定获取表格
$('.query_table').on('click', function () {
    var inputDate = new getInputTime();
    getUsersTableData(-1, "", "boss/queryAllUserList", 'allUsersModal', '.b-Table', 1, 3, "", inputDate._beginTime, inputDate._endTime)
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
        getUsersTableData(-1, _desc, "boss/queryAllUserList", 'allUsersModal', '.b-Table', _PN, 3, "", inputDate._beginTime, inputDate._endTime)
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
        getUsersTableData(-1, _desc, "boss/queryAllUserList", 'allUsersModal', '.b-Table', _PN, 3, "", inputDate._beginTime, inputDate._endTime)
    }
})
//点击排序----升序
$('.b-Table').on('dblclick','#sort',function(){
    var _desc = $(this).attr('mySort');    
    $('.b-Table').attr('desc',_desc)
    var inputDate = new getInputTime();    
    getUsersTableData(-1, _desc, "boss/queryAllUserList", 'allUsersModal', '.b-Table', 1, 3, "", inputDate._beginTime, inputDate._endTime)
    
})
//点击排序----降序
$('.b-Table').on('click','#sort',function(){
    var _desc = $(this).attr('desc');    
    $('.b-Table').attr('desc',_desc)
    var inputDate = new getInputTime();
    getUsersTableData(-1, _desc, "boss/queryAllUserList", 'allUsersModal', '.b-Table', 1, 3, "", inputDate._beginTime, inputDate._endTime)
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

//下载表格
$('.pro-export').on('click',function(){
    window.location.href = boss_url + 'boss/exportExcelUserList';
})

//用户管理概览
function getUsersData() {
    $.ajax({
        url: boss_url + "boss/queryAddedNum",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "date": date._1dayago
        }),
        success: function (res) {
            $('.boss').text(res.data.boss);
            $('.c').text(res.data.c);
            $('.agency').text(res.data.agency);
            $('.agencyC').text(res.data.agencyC);
            $('.statisticsUser').text(res.data.statisticsUser);
            $('.bossCount').text(res.data.bossCount);
            $('.cCount').text(res.data.cCount);
            $('.agencyCount').text(res.data.agencyCount);
            $('.agencyCCount').text(res.data.agencyCCount);
            $('.statisticsCount').text(res.data.statisticsCount);
        }
    })
}

//新增用户走势图
function getNewUserChart(beginTime, endTime) {
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
                var girls = [];
                var agency = [];
                var total = [];
                var xAxisData = [];
                for (var i = 0; i < res.data.length; i++) {
                    BOSS.push(res.data[i]['bossNew']);
                    girls.push(res.data[i].girlNow);
                    agency.push(res.data[i].agencyNew);
                    total.push(res.data[i].userNew);
                    xAxisData.push(res.data[i].date);
                }
                myChart.setOption({
                    title: {
                        text: 'CP触发(实时数据)'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [
                            { name: 'BOSS' },
                            { name: '佳人' },
                            { name: '中介' },
                            { name: '合计' },
                        ]
                    },
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
                            name: 'BOSS',
                            type: 'line',
                            stack: '',
                            data: BOSS
                        },
                        {
                            name: '佳人',
                            type: 'line',
                            stack: '',
                            data: girls
                        },
                        {
                            name: '中介',
                            type: 'line',
                            stack: '',
                            data: agency
                        },
                        {
                            name: '合计',
                            type: 'line',
                            stack: '',
                            data: total
                        }
                    ]
                });
            }
        },
        error: function () {
            console.log('error')
        }
    })
}

//城市分布
function getCityData(zero, vipNum, orderNum, userType) {
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
        error: function () {
            console.log('error')
        }
    })
}