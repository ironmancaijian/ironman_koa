

getReviewData();
getGirlsReviewList(1, 20);
getAgencyReviewList(1, 20)

//审核佳人分页
//上一页
$('.girlsReview').on('click', '.previous', function () {
    var _PN = $('.currPn').text();
    _PN--;
    if (_PN < 1) {
        _PN = 1;
        return false;
    } else {
        getGirlsReviewList(_PN, 20)
    }
})
//下一页
$('.girlsReview').on('click', '.next', function () {
    var _PN = $('.currPn').text();
    var _pageCount = $('.totalPn').text();
    _PN++;
    if (_PN > _pageCount) {
        _PN = _pageCount;
        return false;
    } else {
        getGirlsReviewList(_PN, 20)
    }
})

//审核中介分页
//上一页
$('.b-Table').on('click', '.previous2', function () {
    var _PN = $('.currPn2').text();
    _PN--;
    if (_PN < 1) {
        _PN = 1;
        return false;
    } else {
        getAgencyReviewList(_PN, 20)
    }
})
//下一页
$('.b-Table').on('click', '.next2', function () {
    var _PN = $('.currPn2').text();
    var _pageCount = $('.totalPn2').text();
    _PN++;
    if (_PN > _pageCount) {
        _PN = _pageCount;
        return false;
    } else {
        getAgencyReviewList(_PN, 20)
    }
})

//点击中介获取佳人
$('.b-Table').on('click', '.agencyId', function () {
    var $this = $(this);
    var _id = $this.attr('uid');
    var _top = $this.position().top + 50;
    if ($this.find('i').hasClass('fa-angle-down')) {
        $this.parent().siblings().find('.agencyId').find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        $this.find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
        $('.b-Table .agencyGirlsDiv').css({ "position": "absolute", "top": _top, "left": 0, "margin-bottom": "100px" }).show();
        getAgencyGirlsList(_id, 1, 100, "");
    } else {
        $this.find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        $('.b-Table .agencyGirlsDiv').html('').hide();
    }
})
// 获取中介下佳人
function getAgencyGirlsList(id, pn, pSize, orderbykey) {
    $.ajax({
        url: boss_url + "boss/queryUserCList",
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify({
            id: id,
            pn: pn,
            pSize: pSize,
            orderbykey: orderbykey
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res)
                $('.b-Table .agencyGirlsDiv').html('');
                if (res.data.list.length == 0) {
                    alert('该中介下暂无佳人待审核');
                    $('.b-Table .agencyId').find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
                } else {
                    var html = template('agencyGirlsTemp', res.data);
                    $('.b-Table .agencyGirlsDiv').append(html);
                }
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
}


// 审核数据概览
function getReviewData() {
    $.ajax({
        url: boss_url + "boss/queryAuditManage",
        type: "post",
        contentType: "application/json",
        data: '{}',
        success: function (res) {
            if (res.httpStatus == 200) {
                $('.agencyCount').text(res.data.agencyCount);
                $('.cCount').text(res.data.cCount);
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })

}

// 佳人审核事项列表
function getGirlsReviewList(pn, pSize) {
    $.ajax({
        url: boss_url + "boss/queryAuditGirlList",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            pn: pn,
            pSize: pSize
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                var html = template('girlsReviewTemp', res.data);
                $('.girlsReview').html(html);
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
}
//中介审核事项列表
function getAgencyReviewList(pn, pSize) {
    $.ajax({
        url: boss_url + "boss/queryUserList",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            pn: pn,
            pSize: pSize,
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                var html = template('agencyReview', res.data);
                $('.b-Table').html(html);
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
}

//查询佳人个人信息
$('body').on('click', '.name_evaluate', function () {
    var _id = $(this).attr('uid');
    console.log(_id)
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
                $('.name').text(res.data.name);
                $('.cityId').text(res.data.cityName);
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
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
})
//查询订单记录
$('body').on('click', '.order_evaluate', function () {
    var _uid = $(this).attr('uid');
    var _type = $(this).attr('ordertype');
    console.log(_uid)
    queryOrderList(-1, _type, _uid, ".orderList")
})

// 佳人操作------通过
$('body').on('click', '.cancleBtn', function () {
    var _id = $(this).attr('userId');
    console.log(_id)
    var _auditStatus = $(this).attr('auditStatus');
    $.ajax({
        url: boss_url + "boss/updateAuditGirl",
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify({
            id: _id,
            auditStatus: _auditStatus,
            auditReason: ""
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res)
                var $tr = $('body #tr');
                for (var i = 0; i < $tr.length; i++) {
                    if ($($tr[i]).children().eq(0).text() == _id) {
                        var _this = $($tr[i]);
                        _this.remove();
                        alert('操作成功');
                    }
                }
            } else {
                alert(res.exception+"，请刷新页面");
            }
        },
        error: function () {
            alert('接口错误')
        }
    })
})
$('body').on('click', '.noagree', function () {
    $('#upload_noagree').attr('userId', $(this).attr('userId'));
    $('body #versionIntro').val('');
})
//佳人拒绝
$('body').on('click', '#upload_noagree', function () {
    var _id = $(this).attr('userId');
    var _auditStatus = $(this).attr('auditStatus');
    var _auditReason = $('body #versionIntro').val();

    $.ajax({
        url: boss_url + "boss/updateAuditGirl",
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify({
            id: _id,
            auditStatus: _auditStatus,
            auditReason: _auditReason
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res);
                var $tr = $('body #tr');
                for (var i = 0; i < $tr.length; i++) {
                    if ($($tr[i]).children().eq(0).text() == _id) {
                        var _this = $($tr[i]);
                        console.log(_this.children().eq(0).text());
                        _this.remove();
                        alert('操作成功');
                    }
                }
                $('.fade').hide();
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
})