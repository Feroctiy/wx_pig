// pages/my/info/info.js
var call = require("../../../utils/request.js");
var Utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfo: {}
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 获取详情
  getInfo:function(){
    var that = this
    call.getData("/app/user/appgetuser", {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        that.setData({
          personInfo: res.user,
          id: res.user.DB_USER_ID
        })
      }
    })
  },

  //参数检验
  validtioan: function(e) {
    console.log(e)
    var that = this;
    if (Utils.isEmpty(e.detail.value.U_NICKNAME)) {
      Utils.showMessage("请填写姓名");
      return false
    }
    if (Utils.isEmpty(e.detail.value.U_GENDER)) {
      Utils.showMessage("请填写性别");
      return false
    }
    if (Utils.isEmpty(e.detail.value.U_PHONE)) {
      Utils.showMessage("请填写电话");
      return false
    }
    if (Utils.isEmpty(e.detail.value.U_BIRTHDAY)) {
      Utils.showMessage("请填写生日");
      return false
    }
    if (Utils.isEmpty(e.detail.value.U_ADDRESS)) {
      Utils.showMessage("请填写现居");
      return false
    }
    return true;
  },

  formsubmit(e) {
    console.log(2222)
    console.log(e)
    if (!this.validtioan(e)) {
      return
    }
    call.getData('/app/user/appuserperfect', {
      DB_USER_ID: this.data.id,
      OPENID: wx.getStorageSync('openid'),
      U_NAME: e.detail.value.U_NICKNAME,
      U_GENDER: e.detail.value.U_GENDER,
      U_PHONE: e.detail.value.U_PHONE,
      U_BIRTHDAY: e.detail.value.U_BIRTHDAY,
      U_ADDRESS: e.detail.value.U_ADDRESS
    }, function(res) {
      if (res.state == "success") {
        Utils.showMessage("修改成功");
        wx.navigateBack({
          delta: 1
        })
      }
      console.log(res);
    }, function() {})
  }
})