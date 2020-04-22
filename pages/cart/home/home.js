 var call = require("../../../utils/request.js")
 const app = getApp();
 Page({

   data: {
     cart_img: "http://gw.alicdn.com/tfscom/TB1xdQSJFXXXXcuXXXXy7S8WFXX-176-176.png",
     // 加入购物车的商品
     commodities: [],
     accountInfo: {
       allCount: 0,
       allAccount: 0,
     },
     checkedAll: false,
   },

   onLoad: function (options) {
     this.openId = wx.getStorageSync('openid');
     if (!wx.getStorageSync('openid')) {
       wx.redirectTo({
         url: '/pages/login/login',
         url: `/pages/login/login?from=${this.route}&tab=true`,
       })
     }
     this.getCommodities();
   },

   onShow: function () {
     
     call.getData('/app/shopcar/appusershopcarnum', {
       OPENID: wx.getStorageSync('openid')
     }, function (res) {
       console.log(res.ShopCarNum);
       if (res.state == "success") {

       }
     }, function () {})
   },
   // 获取购物车列表
   getCommodities() {
     wx.showLoading({
       title: '加载中',
     })
     let that = this;
     call.getData('/app/shopcar/appusershopcar', {
       OPENID: wx.getStorageSync('openid')
     }, function (res) {
       wx.hideLoading() 
       if (res.state == "success") { 
         that.setData({
           commodities: res.shopcarlist
         }) 
       }
     }, function () {})
   },
   // 选择 店铺 或 商品
   checked(ev) {
     let dataset = ev.currentTarget.dataset,
       commodities = [].slice.call(this.data.commodities),
       type = dataset.type,
       shopidx = dataset.shopidx;
     if (type === 'shop') {
       let selected = commodities[shopidx]['selected'];
       if (selected) {
         // 取消选中当前店铺包括商品全部
         this.setSelected(commodities, shopidx, null, false);
       } else {
         // 全部选中当前店铺包括商品
         this.setSelected(commodities, shopidx, null, true);
       }
     } else {
       let commodityIdx = dataset.index,
         selected = commodities[shopidx]['store']['shoplist'][commodityIdx].selected;
       if (selected) {
         // 取消选中当前店铺包括商品全部
         this.setSelected(commodities, shopidx, commodityIdx, false);
       } else {
         // 全部选中当前店铺包括商品
         this.setSelected(commodities, shopidx, commodityIdx, true);
       }
     };

     // this.setData({ commodities: result })
   },
   setSelected(commodities, shopidx, commodityIdx, boolean) {
     console.log(commodities, shopidx, commodityIdx, boolean);
     if (!commodities || shopidx == undefined) return;
     let allCount = 0,
       allAccount = 0,
       accountInfo = Object.assign({}, this.data.accountInfo);
     if (commodityIdx == undefined) {
       commodities[shopidx]['selected'] = boolean;
       console.log(commodities[shopidx])
       commodities[shopidx].store.shoplist.forEach(item => {
         item['selected'] = boolean;
         allCount += item['SH_NUM'];
         allAccount += item['SH_MONEY'] * item['SH_NUM'];
       });
       if (!boolean) {
         allAccount = allAccount * -1;
         allCount = allCount * -1
       };
     } else {
       commodities[shopidx].store.shoplist[commodityIdx]['selected'] = boolean;
       allCount += commodities[shopidx].store.shoplist[commodityIdx]['SH_NUM'];
       allAccount += commodities[shopidx].store.shoplist[commodityIdx]['SH_MONEY'] * commodities[shopidx].store.shoplist[commodityIdx]['SH_NUM'];
       if (!boolean) {
         allAccount = allAccount * -1;
         allCount = allCount * -1
       };
       let result = true;
       commodities[shopidx].store.shoplist.forEach(item => {
         result = result && item['selected']
       });
       commodities[shopidx]['selected'] = result;
     }

     accountInfo['allCount'] += allCount;
     accountInfo['allAccount'] += allAccount;

     this.setData({
       commodities,
       accountInfo
     })
     console.log(this);
   },
   // 数量的增减
   onChange(event) {
     var _this = this;
     var id = event.currentTarget.dataset.id;
     call.getData('/app/shopcar/appshopcaradd', {
       DB_SHOPCAR_ID: id,
       NUM: 1
     }, function (res) {
       console.log(res);
       if (res.state == "success") {
         _this.change(event, 'increase')
       }
     }, function () {})
   },
   onMin(event) {
     var _this = this;
     var id = event.currentTarget.dataset.id;
     call.getData('/app/shopcar/appshopcarduceone', {
       DB_SHOPCAR_ID: id,
       NUM: 1
     }, function (res) {
       if (res.state == "success") {
         _this.change(event, 'decrease')
       }
     }, function () {})
   },
   change(ev, type) {
     let dataset = ev.currentTarget.dataset,
       shopidx = dataset['shopidx'],
       commodityidx = dataset['index'],
       commodities = [].concat(this.data.commodities),
       count = commodities[shopidx].store.shoplist[commodityidx].SH_NUM;
     console.log(shopidx, commodityidx, commodities, count)


     if (type === 'decrease') {
       if (count <= 1) {
         wx.showToast({
           title: "宝贝数量已经不能再减少啦！",
           icon: 'none'
         });
       } else {
         commodities[shopidx].store.shoplist[commodityidx].SH_NUM = count - 1;
       }
     } else if (type === 'increase') {
       // 需要判断库存
       commodities[shopidx].store.shoplist[commodityidx].SH_NUM = count + 1;
     };

     console.log(commodities)
     this.getTotal(commodities, shopidx);




     this.setData({
       commodities
     });
   },






   // 数量+金额计算
   getTotal(commodities, shopidx) {
     let allCount = 0,
       allAccount = 0,
       accountInfo = {
         allCount: 0,
         allAccount: 0,
       };
     commodities[shopidx].store.shoplist.forEach(item => {
       if (item.selected) {
         allCount += item['SH_NUM'];
         allAccount += item['SH_MONEY'] * item['SH_NUM'];
       }

     });
     accountInfo['allCount'] += allCount;
     accountInfo['allAccount'] += allAccount;
     this.setData({
       accountInfo
     })
   },
















   // 结算
   cartPay() {
     console.log(this)
     if (this.data.accountInfo.allCount == 0) {
       wx.showToast({
         title: '请先选择商品',
         icon: "none"
       })
       return;
     }
     var shoppingcartlist = [];
     this.data.commodities.forEach(function (v, i) {
       console.log(v);
       console.log(v.store.shoplist)
       v.store.shoplist.forEach(function (x, y) {
         if (x.selected) {
           shoppingcartlist.push(x.DB_SHOPCAR_ID);
         }
       })
     })
     console.log(shoppingcartlist);


     wx.navigateTo({
       url: '/pages/cart/pay-order/pay-order?shoppingcartlist=' + shoppingcartlist,
     })


   },













   // 全选
   checkedAll() {
     let checked = this.data.checkedAll,
       commodities = [].slice.call(this.data.commodities),
       allCount = 0,
       allAccount = 0;
     console.log(commodities)
     commodities.forEach(shop => {
       shop['selected'] = !checked;
       shop['store']['shoplist'].forEach(i => {
         i['selected'] = !checked;
         allCount += i['SH_NUM'];
         allAccount += i['SH_MONEY'] * i['SH_NUM'];
       })
     });

     this.setData({
       commodities,
       accountInfo: {
         allAccount: checked ? 0 : allAccount,
         allCount: checked ? 0 : allCount
       },
       checkedAll: !checked
     })
   },



   // 商品编辑
   edit(ev) {
     let shopIdx = ev.currentTarget.dataset['shopidx'],
       commodities = [].slice.call(this.data.commodities);
     commodities[shopIdx]['isEdit'] = !commodities[shopIdx]['isEdit'];
     this.setData({
       commodities
     });
   },

   // 删除商品
   delCommodity(ev) {
     console.log(ev);
     var id = ev.currentTarget.dataset.id;
     let dataset = ev.currentTarget.dataset,
       shopIdx = dataset['shopidx'],
       commodityIdx = dataset['index'],
       commodities = [].slice.call(this.data.commodities);
     commodities[shopIdx].store.shoplist.splice(commodityIdx, 1); 
     // 判断 店铺中是否还有商品
     if (commodities[shopIdx].store.shoplist.length <= 0) commodities.splice(shopIdx, 1);

     this.setData({
       commodities
     })
    // 
    call.getData('/app/shopcar/appdeleteshopcar', {
      DB_SHOPCAR_ID: id
    }, function (res) {
      if (res.state == "success") {
         
      }
    }, function () {})

   }

 })