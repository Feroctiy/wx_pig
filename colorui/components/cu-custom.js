const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    },
    typeBack: {
      type: String,
      default: '0'
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: '',
    CustomBar: '',
    Custom: ''
  },
  ready(){
    const self = this
    wx.getSystemInfo({
      success: function (res) {
        // 
        


        let custom
        try {
          custom = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
          if (!custom) {
            throw new Error('getMenuButtonBoundingClientRect error')
          }
        } catch (err) {
          // 赋默认数值
          custom = {
            bottom: 82,
            top: 50
          }
        }


        console.log(custom)

        self.setData({
          StatusBar: res.statusBarHeight,
          Custom: custom,
          CustomBar: custom.bottom + custom.top - res.statusBarHeight
        })


        // self.globalData.StatusBar = res.statusBarHeight;
        // self.globalData.Custom = custom;
        // self.globalData.CustomBar = custom.bottom + custom.top - res.statusBarHeight;
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage(e) {

      if (e.currentTarget.dataset.type == '') {
        wx.navigateBack({
          delta: 1
        });
      }

    },
    toHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})