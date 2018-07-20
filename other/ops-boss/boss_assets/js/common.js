//接口地址
var boss_url = "http://39.107.241.222:8083/";

$(".tab_cell").eq(0).show();
$(".btn-default").eq(0).css({
  "background": "rgba(0,0,0,0.6)",
  "color": "#fff"
});
$(".btn-group .btn-default").click(function () {
  $(this).css({
    "background": "rgba(0,0,0,0.6)",
    "color": "#fff"
  }).siblings().css({
    "background": "#fff",
    "color": "#000"
  })
  var num = $(".btn-group .btn-default").index(this);
  $(".tab_cell").hide();
  $(".tab_cell").eq(num).show().siblings().hide();
})



$(function () {

  menuSlideToggle();
  showProgress();
  ajaxProgress();

  // 左侧导航菜单的收起/展开
  function menuSlideToggle() {
    $('.navs ul').prev('a').on('click', function () {
      $(this).next().toggleClass('listUl');
      $(this).parent().siblings().find('ul').addClass('listUl');
    })
  }

  // 加载展示顶部进度条
  function showProgress() {
    NProgress.start();
    $(function () {
      NProgress.done();
    })
  }

  // 发ajax顶部展示进度条
  function ajaxProgress() {
    $(document).ajaxStart(function () {
      NProgress.start();
    })
    $(document).ajaxStop(function () {
      NProgress.done();
    })
  }
})

// 获取当日时间方法
function getCurrentDate() {
  var nowDate = new Date();
  var year = nowDate.getFullYear().toString();
  var month = (nowDate.getMonth() + 1).toString();
  var date = nowDate.getDate().toString();
  if (month < 10) {
    month = '0' + month;
  };
  if (date < 10) {
    date = '0' + date;
  }
  var days1after = Date.UTC(year, month, date) + 1 * 1000 * 3600 * 24;
  var days30 = Date.UTC(year, month, date) - 30 * 1000 * 3600 * 24;
  var days15 = Date.UTC(year, month, date) - 15 * 1000 * 3600 * 24;
  var oldDate = Date.UTC(year, month, date) - 7 * 1000 * 3600 * 24;
  var newDate = Date.UTC(year, month, date) - 1 * 1000 * 3600 * 24;
  cur = new Date(newDate);
  var curYear = cur.getFullYear().toString();
  var curMonth = cur.getMonth().toString();
  var curDate = cur.getDate().toString();
  if (curMonth < 10) {
    curMonth = '0' + curMonth;
  };
  if (curDate < 10) {
    curDate = '0' + curDate;
  }
  var getNewDate = curYear + curMonth + curDate - 0;

  var old = new Date(oldDate);
  var prev = old.getUTCFullYear();//7天前
  prev += ("00" + (old.getUTCMonth())).slice(-2);
  prev += ("00" + old.getUTCDate()).slice(-2);

  var today = year + month + date;
  var todayTime = nowDate.setHours(0, 0, 0, 0);

  var _15ago = new Date(days15);
  _15daysago = _15ago.getUTCFullYear();//15天前
  _15daysago += ("00" + (_15ago.getUTCMonth())).slice(-2);
  _15daysago += ("00" + _15ago.getUTCDate()).slice(-2);;

  var _30ago = new Date(days30);
  _30daysago = _30ago.getUTCFullYear();//30天前
  _30daysago += ("00" + (_30ago.getUTCMonth())).slice(-2);
  _30daysago += ("00" + _30ago.getUTCDate()).slice(-2);;

  var _1after = new Date(days1after);
  _1dayafter = _1after.getUTCFullYear();//1天后
  _1dayafter += ("00" + (_1after.getUTCMonth())).slice(-2);
  _1dayafter += ("00" + _1after.getUTCDate()).slice(-2);;
  // console.log(todayTime)
  // console.log(month)
  // console.log(date)
  // console.log(nowDate)
  // console.log(_15daysago)
  // console.log(_30daysago)  
  var date = {};
  date.today = today;               //当前时间
  date._1dayago = getNewDate;       //1天前时间
  date._7daysago = prev - 0;        //7天前时间
  date._15daysago = _15daysago - 0; //15天前时间
  date._30daysago = _30daysago - 0; //30天前时间
  date._1dayafter = _1dayafter - 0; //1天后时间
  date.todayTime = todayTime;
  return date;
}

//7天前、15天前、30天前 切换
$(".dropdown-menu").on("click", "li a", function () {
  $(this).parent().parent().prev().text($(this).text());
})

//获取输入框中的开始时间和结束时间
function getInputTime() {
  if ($('#dp11').val()) {
    var initTime = $('#dp11').val().split('~')
  } else {
    var initTime = $('#dp11').attr('placeholder').split('~')
  }
  // var initTime = $('#dp11').val().split('~');
  var _beginTime = Date.UTC(initTime[0].split('-')[0], initTime[0].split('-')[1] - 1, initTime[0].split('-')[2])
  var _endTime = Date.UTC(initTime[1].split('-')[0], initTime[1].split('-')[1] - 1, initTime[1].split('-')[2])
  var inputTime = {};
  inputTime._beginTime = _beginTime;
  inputTime._endTime = _endTime;
  return inputTime;
}

//转换时间
function transformTime(time) {
  var Time = new Date(time);
  var year = Time.getFullYear();
  var month = Time.getMonth() + 1;
  var day = Time.getDate();
  var hour = Time.getHours();
  if(hour < 10){
      hour = "0"+hour;
  }
  var minutes = Time.getMinutes();
  if(minutes < 10){
      minutes = "0"+minutes;
  }
  Time = year + '/' + month + '/' + day+ ' ' + hour + ':' + minutes;
  return Time;
}

//订单/门票列表
function getTicketTableData(pn, pSize, url, tempId, dom, beginTime, endTime) {
  $.ajax({
    url: boss_url + url,
    type: 'post',
    data: JSON.stringify({
      pn: pn,
      pSize: 50,
      beginTime: beginTime,
      endTime: endTime
    }),
    contentType: "application/json",
    success: function (res) {
      console.log(res)
      $(dom).html('');
      if (!res.data.list) {
        alert('暂无数据');
      } else {
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].time = transformTime(res.data.list[i].time)
        }
        var html = template(tempId, res.data);
        $(dom).html(html)
      }
    },
    error: function (res) {
      console.log(res)
    }
  })
}

//用户管理Table列表
function getUsersTableData(type, orderkey, url, tempId, dom, pn, pSize, key, beginTime, endTime) {
  $.ajax({
    url: boss_url + url,
    type: 'post',
    contentType: "application/json",
    data: JSON.stringify({
      type: type,
      orderkey: orderkey,
      pn: pn,
      pSize: 50,
      key: key,
      beginTime: beginTime,
      endTime: endTime
    }),
    success: function (res) {
      if (res.httpStatus == 200) {
        console.log(endTime)
        $(dom).html('');
        if (res.data.list.length == 0) {
          alert('该时间段暂无数据');
        } else {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].time = transformTime(res.data.list[i].createTime)
          }
          var html = template(tempId, res.data);
          $(dom).html(html)
        }
      } else {
        console.log(res.exception);
      }
    },
    error: function () {
      console.log('error')
    }
  })
}

//点击门票请求门票记录列表
function queryOrderList(uid, type, detailsId, dom) {
  $.ajax({
    url: boss_url + "boss/queryOrderRecordList",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify({
      uid: uid,
      detailsId: detailsId,
      type: type
    }),
    success: function (res) {
      if (res.httpStatus == 200) {
        $("body " + dom).siblings().text('');
        console.log(res)
        if (res.data) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].successTime = transformTime(res.data[i].successTime)
            console.log(res.data[i].successTime)
            if (type == 0) {
              var _child = '<div>' + res.data[i].successTime + '</div>'
            } else {
              var _child = '<div>' + res.data[i].successTime + '&nbsp;&nbsp;&nbsp;' + res.data[i].amount + '元</div>'
            }
            $("body " + dom).after(_child);
          }
        }
      }else{
        console.log(res.exception);
      }
    },
    error: function (res) {
      console.log(res.statusText)
    }
  })
}

//佳人/中介/虚拟用户----Table列表
function getGirlsTableData(dataJson, url, tempId) {
  $.ajax({
    url: boss_url + url,
    type: 'post',
    contentType: "application/json",
    data: JSON.stringify(dataJson),
    success: function (res) {
      if (res.httpStatus == 200) {
        // console.log(res)
        $('.b-Table').html('');
        if (res.data.list.length == 0) {
          alert('暂无数据');
        } else {
          var html = template(tempId, res.data);
          $('.b-Table').html(html)
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

//检验是否登录、
(function(){
  if(location.href.indexOf('login.html')!=-1) return;
  var mytoken = sessionStorage.getItem('token')//$.cookie('token')
  if(mytoken){
    return;
  }else{
    location.href="./login.html"
  }
})()
