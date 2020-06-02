//项目地址
function getUrl() {
    return 'https://www.xzykcake.com/bake-workshop'
    // return 'http://21n61u9161.51mypc.cn'
}
//图标
function iconsUrl() { 
  // return 'https://lxk.jiafh.com/jladicon'
  return 'https://xcx.hyxt-ec.com/jladicon'
}
function imageUrl() { 
  return 'https://xcx.hyxt-ec.com/xzicon/'
  // return '/images/imgs/'
}
//用户登录
function userLogin(supOpenid) {
  wx.getStorage({ 
    key: 'openid',
    success: function(res) {
      wx.request({
        url: 'https://xcx.hyxt-ec.com/ao-health' + '/app/user/appuserlogin',
        data: {
          OPENID: res.data,
          U_IMG: '',
          U_NICKNAME: '',
          SUP_OPENID: supOpenid
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log('url用户登录', res.data)
          // that.userInfo()
        },
      })
    },
  })
}
module.exports = {
  getUrl: getUrl,
  userLogin: userLogin,
  iconsUrl: iconsUrl,
  imageUrl:imageUrl
}