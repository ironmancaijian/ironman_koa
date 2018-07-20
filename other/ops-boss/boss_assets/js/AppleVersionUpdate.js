

$(function () {

    var normalVersion,//普通版本号
        forceVersion,//强制版本号
        versionIntro,//版本信息
        currPn,//当前页
        totalPn,//总页数
        inputPage,//输入框页码
        testVersion//审核版本号

    //点击新增版本------清空输入框
    $('.pro-export').click(function () {
        $('#upload').text('上传');
        $('#normalVersion').val('');
        $('#forceVersion').val('');
        $('#versionIntro').val('');
        $('#testVersion').val('');
    })

    //点击上传
    $('#upload').click(function () {
        var varsionID = $(this).attr('varsionID');//版本ID
        normalVersion = $('#normalVersion').val();//普通版本号
        forceVersion = $('#forceVersion').val();//强制版本号
        testVersion = $('#testVersion').val();//审核版本号
        versionIntro = $('#versionIntro').val();//版本信息
        if (!normalVersion || !forceVersion || !versionIntro || !testVersion) {
            alert('请完善版本信息！');
            return false;
        }

        if ($(this).text() == '上传') {
            addIOSVersionInfo(versionIntro, forceVersion, testVersion, normalVersion)
        } else {
            data = '{"details":"' + versionIntro + '","forceVersion":' + forceVersion + ',"trialVersion":"' + testVersion + '","type":"IOS","version":' + normalVersion + ',"id":' + varsionID + '}'
            console.log(varsionID)
            console.log(data)

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
                        console.log(res.exception);
                    }
                },
                error: function () {
                    console.log('版本信息修改失败！！')
                }
            })
        }

    });

    //页面加载
    var pn = $('.b-Table currPn').text() - 0;
    if (pn == 0) {
        pn = 1;
        getIOSVersionInfo(pn);
    }

    //分页
    //上一页
    $('.b-Table').on('click', '.previous', function () {
        if (currPn <= 1) {
            currPn = 1;
            return false;
        };
        currPn--;
        getIOSVersionInfo(currPn);
    })
    //下一页
    $('.b-Table').on('click', '.next', function () {
        if (currPn >= totalPn) {
            currPn = totalPn;
            return false;
        };
        currPn++;
        getIOSVersionInfo(currPn);
    });

    //点击开启/关闭
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

    //添加版本信息----方法
    function addIOSVersionInfo(versionIntro, forceVersion, testVersion, normalVersion) {
        data = '{"details":"' + versionIntro + '","forceVersion":' + forceVersion + ',"trialVersion":' + testVersion + ',"type":"IOS","version":' + normalVersion + '}'
        console.log(data)
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

    //开启/关闭版本
    function openVersion(id, isOpen) {
        $.ajax({
            url: boss_url + 'boss/updateIsOpen',
            type: 'post',
            data: JSON.stringify({
                id: id,
                isOpen: isOpen,
                type: 'IOS'
            }),
            contentType: "application/json",
            success: function (res) {
                if (res.httpStatus == 200) {
                    window.location.reload();
                } else {
                    alert(res.exception);
                }
            },
            error: function () {
                console.log('版本操作失败');
            }
        })
    };

    //首页加载
    function getIOSVersionInfo(pn) {
        $.ajax({
            url: boss_url + 'boss/queryVersionList',
            type: 'post',
            async: false,
            data: JSON.stringify({
                type: 'IOS',
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
                console.log('首页列表加载失败');
            }
        })
    }

    //点击编辑
    $('.b-Table').on('click', '.editor', function () {
        $('#upload').text('确定');
        var varsionID = $(this).next().attr('varsionID');
        $.ajax({
            url: boss_url + 'boss/queryVersionInfo',
            type: 'post',
            async: false,
            data: JSON.stringify({
                id: varsionID,
                type: 'IOS'
            }),
            contentType: "application/json",
            success: function (res) {
                if (res.httpStatus == 200) {
                    $('#normalVersion').val(res.data.version);
                    $('#forceVersion').val(res.data.forceVersion);
                    $('#versionIntro').val(res.data.details);
                    $('#upload').attr('varsionID', res.data.id);
                    $('#testVersion').val(res.data.trialVersion);
                }else{
                    console.log(res.exception);
                }
            },
            error: function () {
                console.log('获取原版本信息失败')
            }
        });
    })


})