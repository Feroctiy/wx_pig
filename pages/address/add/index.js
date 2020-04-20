// pages/address/add/index.js
var call = require("../../../utils/request.js");
var Utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    region: ['陕西省', '西安市', '高新区'],
    state: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
  },
  validtioan: function(e) {
    var that = this;
    if (Utils.isEmpty(e.detail.value.ADD_NAME)) {
      Utils.showMessage("请输入收货人姓名");
      return false
    }
    if (Utils.isEmpty(e.detail.value.ADD_PHONE)) {
      Utils.showMessage("请输入收货人手机号");
      return false
    }
    if (Utils.isEmpty(that.data.region[0])) {
      Utils.showMessage("请选择省份");
      return false
    }
    if (Utils.isEmpty(that.data.region[1])) {
      Utils.showMessage("请选择所在市");
      return false
    }
    if (Utils.isEmpty(that.data.region[2])) {
      Utils.showMessage("请选择所在区");
      return false
    }
    if (Utils.isEmpty(e.detail.value.ADD_ADD)) {
      Utils.showMessage("请输入详细地址");
      return false
    }
    return true;
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      state: false
    })
  },
  formsubmit(e) {
    if (!this.validtioan(e)) {
      return
    }
    var that = this;
    call.getData('/app/address/appaddaddress', {
      ADD_LATITUDE: '123',
      ADD_LONGITUDE: "4555",
      ADD_OPENID: wx.getStorageSync('openid'),
      ADD_NAME: e.detail.value.ADD_NAME,
      ADD_PHONE: e.detail.value.ADD_PHONE,
      ADD_ADD: e.detail.value.ADD_ADD,
      ADD_PROVICE: that.data.region[0], //省；
      ADD_CITY: that.data.region[1], //市；
      ADD_REGION: that.data.region[2] //区
    }, function(res) {
      if (res.state == "success") {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 1500
        })
        wx.navigateBack({
          delta: 1
        })
      }
      console.log(res);
    }, function() {})
    // ADD_OPENID：openid    ADD_NAME：收货人     ADD_PHONE：联系电话    ADD_PROVICE：省
    //    ADD_CITY：市    ADD_REGION：区域     ADD_ADD：详细地址     ADD_LONGITUDE：经度     
    //     ADD_LATITUDE：纬度
  }
})