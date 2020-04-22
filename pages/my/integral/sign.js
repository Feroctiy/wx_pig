var app = getApp();
Page({
  data: {
    curHdIndex: "0",
    selectedDate: '',
    selectedWeek: '',
    curYear: 2017,
    curMonth: 0,
    daysCountArr: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dateList: []
  },
  onShow: function () {
    var today = new Date(); //当前时间  
    var y = today.getFullYear(); //年  
    var mon = today.getMonth() + 1; //月  
    var d = add0(today.getDate()); //日  
    var i = today.getDay(); //星期  
    this.setData({
      curYear: y,
      curMonth: mon,
      currentDate: y + '/' + mon + '/' + d,
      selectedDate: "",
      selectedWeek: this.data.weekArr[i]
    });
    this.getDateList(y, mon - 1);
  },
  getDateList: function (y, mon) {
    var vm = this;
    var daysCountArr = this.data.daysCountArr;
    if (y % 4 == 0 && y % 100 != 0) {
      this.data.daysCountArr[1] = 29;
      this.setData({
        daysCountArr: daysCountArr
      });
    }
    var dateList = [];
    dateList[0] = [];
    var weekIndex = 0;
    for (var i = 0; i < vm.data.daysCountArr[mon]; i++) {
      var week = new Date(y, mon, (i + 1)).getDay();
      if (week == 0) {
        weekIndex++;
        dateList[weekIndex] = [];
      }
      if (weekIndex == 0) {
        var v = y + '-' + (mon + 1) + '-' + add0((i + 1));
        var dateItem = {
          value: (y + '-' + (mon + 1) + '-' + add0((i + 1))).replace(/-/g, "/"),
          date: i + 1,
          week: week,
          state: "" // 0 已过去 1 未到来
        }
        // if (v == vm.data.currentDate) {
        //   dateItem = {
        //     value: (y + '-' + (mon + 1) + '-' + add0((i + 1))).replace(/-/g, "/"),
        //     date: "今",
        //     week: week,
        //     state: ""
        //   }
        // }
        dateList[weekIndex].unshift(dateItem);
      } else {
        var v = y + '-' + (mon + 1) + '-' + add0((i + 1)); 
        var dateItem = {
          value: (y + '-' + (mon + 1) + '-' + add0((i + 1))).replace(/-/g, "/"),
          date: i + 1,
          week: week,
          state: ""
        }
        // if (v == vm.data.currentDate) {
        //   dateItem = {
        //     value: (y + '-' + (mon + 1) + '-' + add0((i + 1))).replace(/-/g, "/"),
        //     date: "今",
        //     week: week,
        //     state: ""
        //   }
        // }
        dateList[weekIndex].push(dateItem);
      }
    } 
    vm.setData({
      dateList: dateList
    });
  },
  // 商品点击事件
  selectList: function (e) {
    var dataId = e.currentTarget.dataset.index;
    var vid = e.currentTarget.dataset.vid;
    this.setData({
      curHdIndex: dataId
    });
    this.addSuborder(vid);
  },
  preMonth: function () {
    // 上个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth - 1 ? curYear : curYear - 1;
    curMonth = curMonth - 1 ? curMonth - 1 : 12;
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });

    vm.getDateList(curYear, curMonth - 1);
  },
  nextMonth: function () {
    // 下个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
    curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });
    vm.getDateList(curYear, curMonth - 1);
  }
})

function add0(m) {
  return m < 10 ? '0' + m : m
}

function formatTime1(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber1(date.getMonth() + 1));
  returnArr.push(formatNumber1(date.getDate()));

  returnArr.push(formatNumber1(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber1(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatTime1(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkDate(t) {
  var myDate = new Date(t);
  var mydate = myDate.getDate();
  var m = "";
  if (myDate.getDate() < 10) {
    mydate = '0' + myDate.getDate(); //补齐
  }
  if ((myDate.getMonth() + 1) < 10) {
    m = '0' + (myDate.getMonth() + 1); //补齐
  }
  var today = myDate.getFullYear() + '-' + m + '-' + mydate;
  return today
}