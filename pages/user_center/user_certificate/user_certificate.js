// pages/user_center/user_certificate/user_certificate.js
const api = require('../../../utils/api');
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
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    unionId = wx.getStorageSync('unionId');
    if (openId) {
      wx.request({
        url: api.getCustomer,
        method: 'GET',
        data: {
          openId: openId,
          systemVersion: systemVersion
          //unionId: unionId
        },
        // header: {
        //   'content-type': 'application/json'
        // },
        success: function (res) {
          console.log(res)
          var res = res.data;
          if (res.code == 0) {
          
            let identity = res.data.identity
            if (identity.length==18) {
              identity = identity.substring(0, 6) + "********" + identity.substring(14,18)
            } else {
              identity = identity.substring(0, 6) + "******" + identity.substring(12, 15)
            }
            res.data.identity=identity;
            that.setData({
              user: res.data
            })
          } else {
            tip.tip_msg(that, res.message);
          }
        }
      })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
})