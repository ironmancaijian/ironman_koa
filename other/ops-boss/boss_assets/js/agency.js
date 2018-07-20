

var inputDate = new getInputTime();//获取输入框中的日期
var date = new getCurrentDate();

getAgencyData();
getAgencyChart(date._7daysago, date._1dayago);
getAgencyGirlsChart(date._7daysago, date._1dayago);
getCityDistributionData(0, 0, 0, 2);
getUsersTableData(2, "", "boss/queryAllUserList", "agencyTemp", ".b-Table", 1, 20, "", 0000000000000, new Date())

//中介端佳人列表展示
$('.b-Table').on('click', '.agencyId', function () {
    var $this = $(this);
    var _id = $this.attr('uid');
    var _top = $this.position().top + 100;
    if ($this.find('i').hasClass('fa-angle-down')) {
        $this.parent().siblings().find('.agencyId').find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        $this.find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
        $('.b-Table .agencyGirlsDiv').css({ "position": "absolute", "top": _top, "left": 0, "margin-bottom": "100px" }).show();

        var inputDate = new getInputTime();
        var _dataJson = {
            type: 1,
            id: _id,
            pn: 1,
            pSize: 100,
            key: "",
            beginTime: inputDate._beginTime,
            endTime: inputDate._endTime,
            auditStatus: -1,
            modeltype: 1,
            orderkey: ""
        };
        getGirlsTableData(_dataJson)

    } else {
        $this.find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        $('.b-Table .agencyGirlsDiv').html('').hide();
    }
})
//中介Table列表
function getGirlsTableData(dataJson) {
    $.ajax({
        url: boss_url + "boss/queryCUserList",
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify(dataJson),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res)
                $('.b-Table .agencyGirlsDiv').html('');
                if (res.data.list.length == 0) {
                    alert('该中介下暂无佳人');
                    $('.b-Table .agencyId').find('i').removeClass('fa-angle-up').addClass('fa-angle-down');                    
                } else {
                    var html = template("agencyGirlsTemp", res.data);
                    $('.b-Table .agencyGirlsDiv').append(html)
                }
            } else {
                console.log(res.exception)
            }
        },
        error: function () {
            console.log('error');
        }
    })
}

//中介端佳人查询个人信息
$('.b-Table').on('click', '.name_evaluate', function () {
    var _id = $(this).attr('uid');
    $.ajax({
        url: boss_url + "boss/queryOpsUserC",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: _id
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.name').text(res.data.name);
                $('.cityId').text(res.data.cityId);
                $('.price').text(res.data.price);
                $('.temperament').text(res.data.temperament);

                $('.age').text(res.data.age);
                $('.high').text(res.data.height);
                $('.wai').text(res.data.bust);
                $('.image').text(res.data.identity);

                $('.specialty').text(res.data.specialty);
                $('.custom').text(res.data.introduction);
                $('.shootPlace').text(res.data.region);

                $('.carousel-indicators').html('');
                $('.carousel-inner').html('');
                var imgArr = res.data.photo.split('|');
                for (var i = 0; i < imgArr.length; i++) {
                    var olLi = '<li data-target="#myCarousel" data-slide-to="' + i + '"></li>'
                    var img_div = '<div class="item"><img src="' + imgArr[i] + '"></div>'
                    $('.carousel-indicators').append(olLi);
                    $('.carousel-inner').append(img_div);
                }
                $('.carousel-indicators li:first').addClass('active');
                $('.item:first').addClass('active');
            } else {
                console.log(res.exception)
            }
        },
        error: function () {
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

//中介端佳人操作
$('.b-Table').on('click','.handle',function(){
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

//点击确定获取表格
$('.query_table').on('click', function () {
    var inputDate = new getInputTime();
    getUsersTableData(2, "", "boss/queryAllUserList", 'agencyTemp', '.b-Table', 1, 20, "", inputDate._beginTime, inputDate._endTime)
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
        getUsersTableData(2, _desc, "boss/queryAllUserList", 'agencyTemp', '.b-Table', _PN, 20, "", inputDate._beginTime, inputDate._endTime)
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
        getUsersTableData(2, _desc, "boss/queryAllUserList", 'agencyTemp', '.b-Table', _PN, 20, "", inputDate._beginTime, inputDate._endTime)
    }
})
//点击排序----升序
$('.b-Table').on('dblclick', '#sort', function () {
    var _desc = $(this).attr('mySort');
    $('.b-Table').attr('desc', _desc)
    var inputDate = new getInputTime();
    getUsersTableData(2, _desc, "boss/queryAllUserList", 'agencyTemp', '.b-Table', 1, 20, "", inputDate._beginTime, inputDate._endTime)

})
//点击排序----降序
$('.b-Table').on('click', '#sort', function () {
    var _desc = $(this).attr('desc');
    $('.b-Table').attr('desc', _desc)
    var inputDate = new getInputTime();
    getUsersTableData(2, _desc, "boss/queryAllUserList", 'agencyTemp', '.b-Table', 1, 20, "", inputDate._beginTime, inputDate._endTime)
})

//下载表格
$('.pro-export').on('click',function(){
    window.location.href = boss_url + 'boss/exportExcelAgencyUserList';
})

//中介概览
function getAgencyData() {
    $.ajax({
        url: boss_url + "boss/queryAddedNum",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "date": date._1dayago
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.agency').text(res.data.agency);
                $('.agencyC').text(res.data.agencyC);
                $('.agencyCount').text(res.data.agencyCount);
                $('.agencyCCount').text(res.data.agencyCCount);
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('中介概览请求出错！')
        }
    })
}


//中介数据走势图
function getAgencyChart(beginTime, endTime) {
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
                var agencyData = [];
                var xAxisData = [];
                for (var i = 0; i < res.data.length; i++) {
                    agencyData.push(res.data[i]['agencyNew']);
                    xAxisData.push(res.data[i].date);
                }
                myChart.setOption({
                    title: {
                        text: '中介数据'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: '中介数据', textStyle: { color: '#009af9' } }]
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
                            name: '中介数据',
                            type: 'line',
                            stack: '',
                            data: agencyData
                        }
                    ]
                });
            }
        }
    })

}

//中介端佳人数据走势图
function getAgencyGirlsChart(beginTime, endTime) {
    var myChart = echarts.init(document.getElementById('mychart1'));
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
                var agencyGirls = [];
                var xAxisData = [];
                for (var i = 0; i < res.data.length; i++) {
                    agencyGirls.push(res.data[i]['agencyGirlNew']);
                    xAxisData.push(res.data[i].date);
                }
                myChart.setOption({
                    title: {
                        text: '中介端佳人数据'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [{ name: '中介端佳人数据', textStyle: { color: '#009af9' } }]
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
                            name: '中介端佳人数据',
                            type: 'line',
                            stack: '',
                            data: agencyGirls
                        }
                    ]
                });
            }
        }
    })

}

//中介城市分布
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
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error')
        }
    })
}

function setStatus (data,type) {
    console.log(data)
    var tips = type==0?'下架成功':'上架成功'
    $.ajax({
        url: boss_url + "boss/batchUpDownShelves",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "status": type,
            "id":data.id
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
               alert(tips)
            } else {
                alert(res.exception);
            }
        },
        error: function () {
            alert(res.exception);
        }
    })
}
