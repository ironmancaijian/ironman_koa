

var date = new getCurrentDate();

getVirtualData();
getOPtionsList();

$('.pro-export').on('click', function () {
    $('.mark').show();
})

$('.mark').on('click', '.close', function () {
    $('.mark').hide();
})

//虚拟用户Table
var _dataJson = {
    type: 0,
    id: -1,
    pn: 1,
    pSize: 20,
    key: "",
    auditStatus: 1,
    modeltype: 0,
    orderkey: ""
};
getGirlsTableData(_dataJson, "boss/queryCUserList", "virtualTemp");

//上一页
$('.b-Table').on('click', '.previous', function () {
    var _PN = $('.currPn').text();
    var _desc = $('.b-Table').attr('desc');
    _PN--;
    if (_PN < 1) {
        _PN = 1;
        return false;
    } else {
        var _dataJson = {
            type: 0,
            id: -1,
            pn: _PN,
            pSize: 20,
            key: "",
            auditStatus: 1,
            modeltype: 0,
            orderkey: ""
        };
        getGirlsTableData(_dataJson, "boss/queryCUserList", "virtualTemp");
    }
})
//下一页
$('.b-Table').on('click', '.next', function () {
    var _PN = $('.currPn').text();
    var _pageCount = $('.totalPn').text();
    var _desc = $('.b-Table').attr('desc');
    console.log()
    _PN++;
    if (_PN > _pageCount) {
        _PN = _pageCount;
        return false;
    } else {
        var _dataJson = {
            type: 0,
            id: -1,
            pn: _PN,
            pSize: 20,
            key: "",
            auditStatus: 1,
            modeltype: 0,
            orderkey: ""
        };
        getGirlsTableData(_dataJson, "boss/queryCUserList", "virtualTemp");
    }
})

//点击排序----升序
$('.b-Table').on('dblclick', '#sort', function () {
    var _desc = $(this).attr('mySort');
    $('.b-Table').attr('desc', _desc)
    var _dataJson = {
        type: 0,
        id: -1,
        pn: 1,
        pSize: 20,
        key: "",
        auditStatus: 1,
        modeltype: 0,
        orderkey: _desc
    };
    getGirlsTableData(_dataJson, "boss/queryCUserList", "virtualTemp");
})
//点击排序----降序
$('.b-Table').on('click', '#sort', function () {
    var _desc = $(this).attr('desc');
    $('.b-Table').attr('desc', _desc)
    var _dataJson = {
        type: 0,
        id: -1,
        pn: 1,
        pSize: 20,
        key: "",
        auditStatus: 1,
        modeltype: 0,
        orderkey: _desc
    };
    getGirlsTableData(_dataJson, "boss/queryCUserList", "virtualTemp");
})

//点击新建
$('.pro-export').on('click',function(){
    $('#upload').show();
    $('#editor_upload').hide();
})

// var UP_IMGCOUNT = 0;//图片张数记录

//点击编辑
$('.b-Table').on('click', '.editor', function () {
    $('#upload').hide();
    $('#editor_upload').show();

    var $this = $(this);
    var _id = $this.attr('userid');
    $.ajax({
        url: boss_url + "boss/queryOpsUserC",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: _id
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res)
                $('#editor_upload').attr('uid',res.data.id);
                $('#editor_upload').attr('uType',res.data.type);
                // $('.hidden_input').val(res.data.photo);
                $('.mark #girl_name').val(res.data.name);
                var $price = $('.mark #opt_标价 option');
                for (var i = 0; i < $price.length; i++) {
                    if ($($price[i]).attr('value') == res.data.price) {
                        $($price[i]).attr('selected', 'selected');
                    }
                }
                var $temperament = $('.mark #opt_气质 option');
                for (var i = 0; i < $temperament.length; i++) {
                    if ($($temperament[i]).attr('value') == res.data.temperament) {
                        $($temperament[i]).attr('selected', 'selected');
                    }
                }
                var $age = $('.mark #opt_年龄 option');
                for (var i = 0; i < $age.length; i++) {
                    if ($($age[i]).attr('optid') == res.data.age) {
                        $($age[i]).attr('selected', 'selected');
                    }
                }
                var $height = $('.mark #opt_身高 option');
                for (var i = 0; i < $height.length; i++) {
                    if ($($height[i]).attr('optid') == res.data.height) {
                        $($height[i]).attr('selected', 'selected');
                    }
                }
                var $bust = $('.mark #opt_上围 option');
                for (var i = 0; i < $bust.length; i++) {
                    if ($($bust[i]).attr('optid') == res.data.bust) {
                        $($bust[i]).attr('selected', 'selected');
                    }
                }
                var $identity = $('.mark #opt_形象 option');
                for (var i = 0; i < $identity.length; i++) {
                    if ($($identity[i]).attr('optid') == res.data.identity) {
                        $($identity[i]).attr('selected', 'selected');
                    }
                }
                var $region = $('.mark #opt_拍摄地 option');
                for (var i = 0; i < $region.length; i++) {
                    if ($($region[i]).attr('optid') == res.data.region) {
                        $($region[i]).attr('selected', 'selected');
                    }
                }
                var $city = $('.mark #girl_city option');
                for (var i = 0; i < $city.length; i++) {
                    if ($($city[i]).attr('cityid') == res.data.city) {
                        $($city[i]).attr('selected', 'selected');
                    }
                }
                var checkbox = $('input[type=checkbox]');
                var _specialty = res.data.specialty.split('|');
                for (var i = 0; i < checkbox.length; i++) {
                    for (var j = 0; j < _specialty.length; j++) {
                        if ($(checkbox[i]).attr('optid') == $(_specialty)[j]) {
                            $(checkbox[i]).attr('checked', 'checked');
                        }
                    }
                }
                var img_src = res.data.photo.split('|')
                $("#div_imglook").html('<div style="clear: both;"></div>');
                
                for (var i = 0; i < img_src.length; i++) {
                    //创建预览外层
                    var _prevdiv = document.createElement("div");
                    _prevdiv.setAttribute("class", "lookimg");
                    //创建内层img对象
                    var preview = document.createElement("img");
                    $(_prevdiv).append(preview);
                    //创建删除按钮
                    var IMG_DELBTN = document.createElement("div");
                    IMG_DELBTN.setAttribute("class", "lookimg_delBtn");
                    IMG_DELBTN.innerHTML = "移除";
                    $(_prevdiv).append(IMG_DELBTN);
                    //记录此对象对应编号
                    _prevdiv.setAttribute("num", "imged");
                    //对象注入界面
                    $("#div_imglook").children("div:last").before(_prevdiv);
                    // UP_IMGCOUNT++;//编号增长防重复
                    preview.src = img_src[i];
                }
                // $('#upload')
                $('.mark').show();

            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
})

//查询佳人个人信息
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
                console.log(res.exception);
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
    queryOrderList(-1, _type, _uid, ".orderList")
})

//佳人操作
$('.b-Table').on('click', '.cancleBtn', function () {
    var _id = $(this).attr('userId');
    var _salesStatus = $(this).attr('salesStatus');
    $.ajax({
        url: boss_url + "boss/updateOpsUserC",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: _id,
            status: _salesStatus
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                alert('操作成功！');
                window.location.reload();
            } else {
                console.log(res.exception)
            }
        },
        error: function () {
            console.log('error')
        }
    })
})


//虚拟用户概览
function getVirtualData() {
    $.ajax({
        url: boss_url + "boss/queryFictitiousNum",
        type: "post",
        contentType: "application/json",
        data: '{}',
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.data').text(res.data);
            }
        },
        error: function () {
            alert('虚拟用户概览请求出错！')
        }
    })
}

//获取下拉列表
function getOPtionsList() {
    $.ajax({
        url: boss_url + "boss/updateFictitiousInfoDict",
        type: "post",
        contentType: "application/json",
        data: '{}',
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res)
                var html = template('optionsTemp', res.data)
                $('.girlName').after(html)

            } else {
                console.log(res.exception)
            }
        },
        error: function () {
            alert('获取option下拉框出错');
        }
    })
}