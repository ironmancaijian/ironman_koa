
var inputDate = new getInputTime();//获取输入框中的日期
var date = new getCurrentDate();

getGirlsData();
getGirlsChart(date._7daysago, date._1dayago);
getGirlsCityData(0, 0, 0, 0);

var _dataJson = {
    type: 1,
    id: -1,
    pn: 1,
    pSize: 20,
    key: "",
    beginTime: 0,
    endTime: 1508371200000,
    auditStatus: 1,
    modeltype: 0,
    orderkey: ""
};
getGirlsTableData(_dataJson, "boss/queryCUserList", "girlsTemp")
//点击确定获取表格
$('.query_table').on('click', function () {
    var inputDate = new getInputTime();
    var _dataJson = {
        type: 1,
        id: -1,
        pn: 1,
        pSize: 20,
        key: "",
        beginTime: inputDate._beginTime,
        endTime: inputDate._endTime,
        auditStatus: 1,
        modeltype: 0,
        orderkey: ""
    };
    getGirlsTableData(_dataJson, "boss/queryCUserList", "girlsTemp")
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
        var _dataJson = {
            type: 1,
            id: -1,
            pn: _PN,
            pSize: 20,
            key: "",
            beginTime: inputDate._beginTime,
            endTime: inputDate._endTime,
            auditStatus: 1,
            modeltype: 0,
            orderkey: _desc
        };
        getGirlsTableData(_dataJson, "boss/queryCUserList", "girlsTemp")
    }
})
//下一页
$('.b-Table').on('click', '.next', function () {
    var _inputDate = new getInputTime();
    var _PN = $('.currPn').text();
    var _pageCount = $('.totalPn').text();
    var _desc = $('.b-Table').attr('desc');
    _PN++;
    if (_PN > _pageCount) {
        _PN = _pageCount;
        return false;
    } else {
        var _dataJson = {
            type: 1,
            id: -1,
            pn: _PN,
            pSize: 20,
            key: "",
            beginTime: inputDate._beginTime,
            endTime: inputDate._endTime,
            auditStatus: 1,
            modeltype: 0,
            orderkey: _desc
        };
        getGirlsTableData(_dataJson, "boss/queryCUserList", "girlsTemp")
    }
})
//点击排序----升序
$('.b-Table').on('dblclick','#sort',function(){
    var _desc = $(this).attr('mySort');    
    $('.b-Table').attr('desc',_desc)
    var inputDate = new getInputTime();
    var _dataJson = {
        type: 1,
        id: -1,
        pn: 1,
        pSize: 20,
        key: "",
        beginTime: inputDate._beginTime,
        endTime: inputDate._endTime,
        auditStatus: 1,
        modeltype: 0,
        orderkey: _desc
    };
    getGirlsTableData(_dataJson, "boss/queryCUserList", "girlsTemp")
})
//点击排序----降序
$('.b-Table').on('click','#sort',function(){
    var _desc = $(this).attr('desc');    
    $('.b-Table').attr('desc',_desc)
    var inputDate = new getInputTime();
    var _dataJson = {
        type: 1,
        id: -1,
        pn: 1,
        pSize: 20,
        key: "",
        beginTime: inputDate._beginTime,
        endTime: inputDate._endTime,
        auditStatus: 1,
        modeltype: 0,
        orderkey: _desc
    };
    getGirlsTableData(_dataJson, "boss/queryCUserList", "girlsTemp")
})

//查询佳人个人信息
$('.b-Table').on('click','.name_evaluate',function(){
    var _id = $(this).attr('uid');
    $.ajax({
        url: boss_url + "boss/queryOpsUserC",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: _id
        }),
        success:function(res){
            if (res.httpStatus == 200) {
                $('.name').text(res.data.name);
                $('.cityId').text(res.data.cityId);
                $('.price').text(res.data.price);
                $('.temperament').text(res.data.temperament);

                $('.carousel-indicators').html('');
                $('.carousel-inner').html('');
                var imgArr = res.data.photo.split('|');
                for(var i=0;i<imgArr.length;i++){
                    var olLi = '<li data-target="#myCarousel" data-slide-to="'+i+'"></li>'
                    var img_div = '<div class="item"><img src="'+imgArr[i]+'"></div>'
                    $('.carousel-indicators').append(olLi);
                    $('.carousel-inner').append(img_div);
                }
                $('.carousel-indicators li:first').addClass('active');
                $('.item:first').addClass('active');
            }else{
                console.log(res.exception);                
            }
        },
        error:function(){
            console.log('error');
        }
    })
})

//查询订单记录
$('.b-Table').on('click', '.order_evaluate', function () {
    var _uid = $(this).attr('uid');
    var _type = $(this).attr('ordertype');
    console.log(_uid)
    queryOrderList(-1,_type,_uid, ".orderList")
})

//佳人操作
$('.b-Table').on('click','.cancleBtn',function(){
    var _id = $(this).attr('userId');
    var _salesStatus = $(this).attr('salesStatus');
    $.ajax({
        url: boss_url + "boss/updateOpsUserC",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: _id,
            status:_salesStatus
        }),
        success:function(res){
            if(res.httpStatus == 200){
                alert('操作成功！');
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
    window.location.href = boss_url + 'boss/exportExcelCUserList';
})

//佳人概览
    function getGirlsData() {
    $.ajax({
        url: boss_url + "boss/queryAddedNum",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "date": date._1dayago
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.c').text(res.data.c);
                $('.cCount').text(res.data.cCount);
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log("佳人概览请求出错！")
        }
    })
}

//佳人数据走势图
function getGirlsChart(beginTime, endTime) {
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
                var girls = [];
                var xAxisData = [];
                for (var i = 0; i < res.data.length; i++) {
                    girls.push(res.data[i]['girlNow']);
                    xAxisData.push(res.data[i].date);
                }
                myChart.setOption({
                    title: {
                        text: '佳人数据'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: '佳人数据', textStyle: { color: '#009af9' } }]
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
                            name: '佳人数据',
                            type: 'line',
                            stack: '',
                            data: girls
                        }
                    ]
                });

            } else {
                console.log(res.exception)
            }
        },
        error: function () {
            console.log('error');
        }
    })
}

//城市分布
function getGirlsCityData(zero, vipNum, orderNum, userType) {
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
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })

}




