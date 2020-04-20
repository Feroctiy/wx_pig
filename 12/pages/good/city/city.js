// pages/demo/demo.js
let city = require('../../../utils/allcity.js'); 

Page({

  data: {
    city: [],
    config: {
      horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      searchHeight: 45, // 搜索条高度
      suctionTop: true // 是否开启标题吸顶
    }
  },
  onLoad() {
    // wx.showLoading({
    //   title: '加载数据中...',
    // })
    // // 模拟服务器请求异步加载数据
    // setTimeout(()=>{
    this.setData({
      city: city
    })
    //   wx.hideLoading()
    // },2000)

  },
  bindtap(e) {
    console.log(e.detail)
    // if (e.detail && e.detail.name) {
    //   console.log(e.detail.name)
    //   wx.setStorageSync(api.SELECT_CITY, {city:e.detail.name})
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // }
  }

})