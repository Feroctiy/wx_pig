//index.js
//获取应用实例
const app = getApp();
var call = require("../../utils/request.js");

Page({
  data: {
    gridCol: 5,
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
    indexData:{}
  },
  onLoad: function (options) {
    // console.log(options);
    // this.pos();
    var _this = this;
    call.getData('/app/user/appgetstoreHome', {
      LAT: "34.34127",
      LON: "108.93984"
    }, function (res) {
      console.log(res);
      wx.setStorageSync('DB_STORE_ID',res.store[0].DB_STORE_ID)
      if (res.status == "success") {
        call.getData('/app/user/appgetplat', {
          DB_STORE_ID:res.store[0].DB_STORE_ID
        }, function (res) {
          _this.setData({
            indexData:res
          })
        }, function () {})

      }
    }, function () {})

  },
  pos: function () {
    console.log("呼呼呼呼呼")
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.cancel) {} else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      that.path();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          that.path();
        } else {
          that.path();
        }
      }
    })
  },
  path: function () {


    //获取用户的初始位置
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        wx.setStorageSync('start_long', res.longitude);
        wx.setStorageSync('start_lati', res.latitude);
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goDetail(e) {
   if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    } 
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id='+e.currentTarget.dataset.id
    })
  },
  goGoods() {
    wx.navigateTo({
      url: '/pages/goods/index/index'
    })
  },
  goSearch(){
    wx.navigateTo({
      url: '/pages/goods/search/search',
    })
  },
  goNotice(){
    wx.navigateTo({
      url: '/pages/notice/notice',
    })
  },
  goBanner(e){
    console.log(e);
    wx.navigateTo({
      url: '/pages/goods/loop/loop?id='+e.currentTarget.dataset.id,
    })
  }
})