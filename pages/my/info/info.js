// pages/my/info/info.js
var call = require("../../../utils/request.js");
var Utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfo: {},
    date: '',
    state: true,
    sex: [{
        name: '1',
        value: '男'
      },
      {
        name: '2',
        value: '女',
        checked: 'true'
      },
    ],
    gender:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 时间选择器
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      state: false
    })
  },
  // 性别选择
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e)
     this.setData({
      gender:e.detail.value,
    })

  },

  // 获取详情
  getInfo: function() {
    var that = this
    call.getData("/app/user/appgetuser", {
      OPENID: wx.getStorageSync('openid')
    }, function(res) {
      if (res.state == "success") {
        that.setData({
          personInfo: res.user,
          id: res.user.DB_USER_ID,
          date: res.user.U_BIRTHDAY,
          state: false,
          gender: res.user.U_GENDER
        })
      }
    })
  },

  //参数检验
  validtioan: function(e) {
    var that = this;
    if (Utils.isEmpty(e.detail.value.U_NICKNAME)) {
      Utils.showMessage("请填写姓名");
      return false
    }
    if (Utils.isEmpty(that.data.gender)) {
      Utils.showMessage("请选择性别");
      return false
    }
    // if (Utils.isEmpty(e.detail.value.U_PHONE)) {
    //   Utils.showMessage("请填写电话");
    //   return false
    // }
    if (Utils.isEmpty(that.data.date)) {
      Utils.showMessage("请选择出生日期");
      return false
    }
    if (Utils.isEmpty(e.detail.value.U_ADDRESS)) {
      Utils.showMessage("请填写现居");
      return false
    }
    return true;
  },

  //完善信息
  formsubmit(e) {
    // if (!this.validtioan(e)) {
    //   return
    // }
    var that = this;
    call.getData('/app/user/appuserperfect', {
      DB_USER_ID: this.data.id,
      OPENID: wx.getStorageSync('openid'),
      U_NAME: e.detail.value.U_NICKNAME,
      U_GENDER: that.data.gender,
      U_PHONE: '',
      U_BIRTHDAY: that.data.date,
      U_ADDRESS: e.detail.value.U_ADDRESS
    }, function(res) {
      if (res.state == "success") {
        Utils.showMessage("修改成功");
        wx.navigateBack({
          delta: 1
        })
      }
    }, function() {})
  }
})