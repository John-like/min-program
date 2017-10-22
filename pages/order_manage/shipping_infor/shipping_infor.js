// pages/order_manage/shipping_infor/shipping_infor.js
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var systemVersion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    if(openId) {
      
    }
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
    systemVersion = getApp().globalData.systemVersion
  },

  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },

  // 点击折叠当前订单
  shrink: function(){
    this.setData({
      open:!this.data.open
    })
  }
 
})