


getHomeGirlsData();
//获取佳人列表
function getHomeGirlsData() {
    $.ajax({
        url: boss_url + "boss/queryTopModelList",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            cityId: -1
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res)
                var $option = $('.b-Table option');
                for (var i = 0; i < $option.length; i++) {
                    if ($($option[i]).text() == res.data) {

                    }
                }
                var html = template('pushGirlsTemp', res);
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
$('.b-Table').on('click', '.name_evaluate', function () {
    var _id = $(this).attr('uid');
    $.ajax({
        url: boss_url + "boss/queryModelInfo",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: _id
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res)
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
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
})

// 佳人操作
$('.b-Table').on('click', '.cancleBtn', function () {
    var _id = $(this).attr('userId');
    console.log(_id)
    $.ajax({
        url: boss_url + "boss/updateManageModel",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            modelId: _id,
            sort: 0
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res);
                getHomeGirlsData();
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
})

// 佳人置顶排序
$('.b-Table').on('change', '#tr select', function () {
    var newSort = $(this).find("option:selected").text();
    var modelId = $(this).attr('modelId');
    console.log(newSort);
    console.log(modelId);
    $.ajax({
        url: boss_url + "boss/updateManageModel",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            modelId: modelId,
            sort: newSort
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res);
                getHomeGirlsData();
            } else {
                console.log(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
})

// 点击搜索
$('.search').on('click', function () {
    var modelId = $('.idNum').val();
    var sort = $('.sortNum').val();
    $.ajax({
        url: boss_url + "boss/updateManageModel",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            modelId: modelId,
            sort: sort
        }),
        success: function (res) {
            if (res.httpStatus == 200) {
                console.log(res);
                $('.fade').hide();
                getHomeGirlsData();
            } else {
                alert(res.exception);
            }
        },
        error: function () {
            console.log('error');
        }
    })
})