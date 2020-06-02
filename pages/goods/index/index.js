const app = getApp();
var call = require("../../../utils/request.js");
var PULLNUM = 0;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [{
        id: "1",
        name: "慕斯蛋糕"
      },
      {
        id: "2",
        name: "裱花蛋糕"
      },
    ],
    load: true,
    indexData:{},
    typeList:[],
    goodslist:[]
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.setData({
      listCur: this.data.list[0].id
    })

    var _this = this;
    call.getData('/app/user/appgetplat', {
      DB_STORE_ID:  wx.getStorageSync('DB_STORE_ID')
    }, function (res) {
      _this.setData({
        indexData: res
      })
    }, function () {})


    _this.getTypeList();

  },
  // 查看分类
  getTypeList(){
    var _this = this;
    call.getData('/app/goods/appgetgoodstype', {}, function (res) {
      if(res.state == 'success'){
        _this.setData({
          typeList: res.type,
          typeName:res.type[0].T_NAME
        })
        _this.viewGoodsById(res.type[0].DB_TYPE_ID)
      }
    }, function () {})
  },
  // 通过分类看商品
  viewGoodsById(id){
    var _this = this;
    call.getData('/app/goods/appgoodslist', {
      DB_STORE_ID:  wx.getStorageSync('DB_STORE_ID'),
      PULLNUM : PULLNUM,
      G_TYPE_ID:id
    }, function (res) {
      console.log(res);
      if(res.state == 'success'){
        _this.setData({
          goodslist:res.goods
        })
      }
    }, function () {})
  },


















  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50,
      typeName:e.currentTarget.dataset.name,
      goodslist:[]
    })
    this.viewGoodsById(e.currentTarget.dataset.typeid)
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
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
      url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id
    })
  }
})