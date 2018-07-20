$(function () {

    var pn = 1
    queryTipOffList(1, 20)
    function queryTipOffList(pn, pSize) {
        $.ajax({
            url: boss_url + 'boss/queryTipOffList',
            type: 'post',
            data: JSON.stringify({
                pn: pn,
                pSize: pSize
            }),
            contentType: "application/json",
            success: function (data) {
                if (data.httpStatus == 200) {
                    console.log(data)
                    for (var i = 0; i < data.data.length; i++) {
                        var imgUrlArr = data.data[i].image.split(',');
                        data.data[i].imageArray = imgUrlArr;
                        data.data[i].createTime = transformTime(data.data[i].createTime);
                    }
                    var html = template('reportTemp', data);
                    $('.b-Table').html(html);
                }
            },
            error: function () {
                console.log('获取举报列表信息失败！')
            }
        })
    }

    //转换时间
    function transformTime(time) {
        var Time = new Date(time);
        var year = Time.getFullYear();
        var month = Time.getMonth() + 1;
        var day = Time.getDate();
        var hour = Time.getHours();
        if (hour < 10) {
            hour = '0' + hour;
        }
        var min = Time.getMinutes();
        if (min < 10) {
            min = '0' + min;
        }
        Time = year + '/' + month + '/' + day + ' ' + hour + ':' + min;
        return Time;
    }

    //上一页
    $('.b-Table').on('click', '.previous', function () {
        if (pn <= 1) {
            pn = 1
            return false;
        }
        pn--;
        queryTipOffList(pn, 20)
    })
    //下一页
    $('.b-Table').on('click', '.next', function () {
        if ($(this).parent().parent().find('table').find('tr').length < 21) {
            return false;
        }
        pn++;
        queryTipOffList(pn, 20);
    })

    $('.main').on('click', '.reportImg', function () {
        // $('.reportMark').show();
        $('.bigPic').attr('src', $(this).attr('src'));
    })
    // $('.fa-times').click(function () {
    //     $('.reportMark').hide();
    // })

    $('.b-Table').on('click', '.handle', function () {
        var tipOffId = $(this).attr('reportid');
        var uid = $(this).attr('uid');
        var type = $(this).attr('type');
        // console.log(tipOffId)
        // console.log(uid)
        // console.log(type)

        $.ajax({
            url: boss_url + 'boss/setTipOffInfo/' + tipOffId + '/' + uid + '/' + type,
            type: 'get',
            success: function (data) {
                if (data.httpStatus == 200) {
                    window.location.reload();
                }
            }
        })
    })
})