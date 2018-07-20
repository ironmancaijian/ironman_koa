

$(function () {

    var file,//获得文件
        _size,//文件大小
        _name,//文件名称
        _suffix,//文件后缀
        normalVersion,//普通版本号
        forceVersion,//强制版本号
        versionIntro,//版本信息
        UpToken,//获取token
        qiniuUrl,//七牛地址
        http_url,//上传完成后的地址
        currPn,//当前页
        totalPn,//总页数
        inputPage//输入框页码

    //首页加载
    var pn = $('.b-Table .currPn').text() - 0;
    if (pn == 0) {
        pn = 1;
        getAndroidVersionInfo(pn);
    }

    //分页
    //上一页
    $('.b-Table').on('click', '.previous', function () {
        if (currPn <= 1) {
            currPn = 1;
            return false;
        };
        currPn--;
        getAndroidVersionInfo(currPn);
    })
    //下一页
    $('.b-Table').on('click', '.next', function () {
        if (currPn >= totalPn) {
            currPn = totalPn;
            return false;
        };
        currPn++;
        getAndroidVersionInfo(currPn);
    });

    //版本操作
    $('.b-Table').on('click', '.handle', function () {
        //版本id
        var id = $(this).attr('varsionID');
        //版本状态
        var isOpen = $(this).attr('isOpen');
        if (isOpen == 0) {
            isOpen = 1
        } else {
            isOpen = 0
        };
        openVersion(id, isOpen);
    });

    //点击新增版本------清空输入框
    $('.pro-export').click(function () {
        $('#apkName').css('display', 'block');
        $('#normalVersion').val('');
        $('#forceVersion').val('');
        $('#overview').text('');
        $('#versionIntro').val('');
    })

    //添加文件
    $('#apkName').on('change', function () {
        file = $(this)[0].files[0];//获得文件
        // console.log(file);
        _size = file.size / 1024 / 1024;//文件大小(Mb)
        _size = _size.toString().substring(0, _size.toString().indexOf('.') + 2)
        // console.log(_size);
        $('#apkSize').css('display', 'block').text('文件大小:' + _size + 'Mb')
    });

    //点击上传
    $('#upload').click(function () {
        // console.log(file)
        // console.log(_size)

        var varsionID = $(this).attr('varsionID')
        normalVersion = $('#normalVersion').val();//普通版本号
        forceVersion = $('#forceVersion').val();//强制版本号
        versionIntro = $('#versionIntro').val();//版本信息
        if (!normalVersion || !forceVersion || !versionIntro) {
            alert('请完善版本信息！');
            return false;
        }

        //此条件判断点击编辑时有无链接------有则直接上传
        if ($('#overview').text()) {
            console.log(versionIntro)
            //判断链接是否为 http://xxx.apk 格式
            var editorLink = $('#overview').text();

            console.log(varsionID)
            // console.log(editorLink.substring(0,7)) //   http://
            // console.log(editorLink.substring(editorLink.length-4,editorLink.length));//  .apk
            // console.log(editorLink)
            data = '{"details":"' + versionIntro + '","forceVersion":' + forceVersion + ',"link":"' + editorLink + '","type":"ANDROID","version":' + normalVersion + ',"id":' + varsionID + '}'

            $.ajax({
                url: boss_url + 'boss/updateVersion',
                type: 'post',
                data: data,
                contentType: "application/json",
                success: function (res) {
                    if (res.httpStatus == 200) {
                        alert('版本信息修改成功');
                        window.location.reload();
                    } else {
                        console.log(res.httpStatus);
                    }
                },
                error: function () {
                    console.log('版本信息修改失败！！')
                }
            })
            return false;
        }

        if (!file) {
            alert('请选择文件！');
            return false;
        }
        _name = file.name;//文件名称
        _suffix = _name.split('.')[_name.split('.').length - 1];//文件后缀
        if (!_suffix || _suffix !== 'apk') {
            alert('请选择.apk格式的文件！！');
            return false;
        };

        // console.log(normalVersion);
        // console.log(forceVersion);
        // console.log(versionIntro);

        // 请求七牛
        $.ajax({
            url: boss_url + '/hunter/getQiNiuToken',
            type: 'post',
            async: false,
            contentType: "application/json",
            data: JSON.stringify({
                name: 'android'
            }),
            success: function (data) {
                // console.log(data.data);
                UpToken = data.data.token;
                qiniuUrl = data.data.url;
            }
        })
        // console.log(UpToken)
        // console.log(qiniuUrl)

        //获取时间戳
        // var timeStamp = getCurrentDate();
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var timeStamp = year + '-' + month + '-' + day + '-' + hour;
        // 文件上传
        var formData = new FormData();
        formData.append('token', UpToken);
        formData.append('file', file);
        formData.append('key', 'sgld-boss' + timeStamp + '-' + normalVersion + '.apk');
        console.log(formData)
        $.ajax({
            url: 'http://up-z1.qiniu.com',
            type: 'post',
            processData: false,
            contentType: false,
            // async:false,
            data: formData,
            Authorization: 'UpToken' + UpToken,
            beforeSend: function () {
                $('#overview').text('文件上传中，请稍后...');
            },
            success: function (res) {
                http_url = qiniuUrl + '/' + res.key;
                //上传版本
                addAndroidVersionInfo(versionIntro, forceVersion, http_url, normalVersion);

                $('#overview').text('上传完成！！！');
                // alert('上传完成！！！');
                // window.location.reload();
            },
            error: function (res) {
                $('#overview').text('文件上传失败！！！')
                console.log('文件上传失败！！！');
            }
        })
    });

    //点击编辑
    $('.b-Table').on('click', '.editor', function () {
        var varsionID = $(this).next().attr('varsionID');

        $.ajax({
            url: boss_url + 'boss/queryVersionInfo',
            type: 'post',
            // async: false,
            data: JSON.stringify({
                id: varsionID
            }),
            contentType: "application/json",
            success: function (res) {
                $('#apkName').css('display', 'none');
                $('#normalVersion').val(res.data.version);
                $('#forceVersion').val(res.data.forceVersion);
                $('#overview').text(res.data.link);
                $('#versionIntro').val(res.data.details);
                $('#upload').attr('varsionID', res.data.id);
            },
            error: function (res) {
                console.log(res);
            }
        })
    })

    //获取版本列表
    function getAndroidVersionInfo(pn) {
        $.ajax({
            url: boss_url + 'boss/queryVersionList',
            type: 'post',
            async: false,
            data: JSON.stringify({
                type: 'ANDROID',
                pn: pn,
                pSize: 10
            }),
            contentType: "application/json",
            success: function (res) {
                if (res.httpStatus == 200) {
                    var html = template('AndroidInfoTemp', res.data);
                    $('.b-Table').html(html);
                    currPn = $('.b-Table .currPn').text() - 0;
                    totalPn = $('.b-Table .totalPn').text() - 0;
                } else {
                    console.log(res.exception);
                }
            },
            error: function () {
                // console.log(res.responseText);
            }
        })
    }

    //开启/关闭版本
    function openVersion(id, isOpen) {
        $.ajax({
            url: boss_url + 'boss/updateIsOpen',
            type: 'post',
            data: JSON.stringify({
                id: id,
                isOpen: isOpen,
                type: 'ANDROID'
            }),
            contentType: "application/json",
            success: function (res) {
                if (res.httpStatus == 0) {
                    alert(res.exception);
                } else if (res.httpStatus == 200) {
                    window.location.reload();
                }
            },
            error: function (res) {
                console.log(res);
            }
        })
    };

    //添加版本信息----方法
    function addAndroidVersionInfo(versionIntro, forceVersion, http_url, normalVersion) {
        data = '{"details":"' + versionIntro + '","forceVersion":' + forceVersion + ',"link":"' + http_url + '","type":"ANDROID","version":' + normalVersion + '}'
        $.ajax({
            url: boss_url + 'boss/insertVersion',
            type: 'post',
            data: data,
            contentType: "application/json",
            success: function (res) {
                if (res.httpStatus == 200) {
                    alert('版本上传成功');
                    window.location.reload();
                } else {
                    console.log(res.exception);
                }
            },
            error: function () {
                console.log('版本上传失败！！')
            }
        })
    };

})