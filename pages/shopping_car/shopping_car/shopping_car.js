// pages/component/shopping_car.js
const api = require('../../../utils/api');
const tip = require("../../../utils/tip.js");
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
    // user:{
    //   name:"皮皮虾",
    //   phone:"18888888888"
    // },
    aaa:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');

    if(openId) {
      wx.request({
        url: api.queryCommodityListFromShoppingCart,
        data: {
          openId: openId,
          //unionId:unionId,
          systemVersion: systemVersion
        },
        success: function (res) {
          var res = res.data
          console.log(res)
          if (res.code == 0) {
            that.setData({

            })

          } else {
            //tip.tip_msg(that,"错误啦")
            //tip.tip_msg(that, res.message)
          }
        }
      })
    }
      
  },

  /**生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
    systemVersion = getApp().globalData.systemVersion
    if (openId) {
      //更新客户状态
      wx.request({
        url: api.getCustomerStatus,
        data: {
          openId: openId,
          systemVersion: systemVersion
          //unionId: unionId,
        },
        success: function (res) {
          var res = res.data;
          if (res.code == 0) {
            console.log(res.data.statusStr)
            wx.setStorageSync('customerstatusStr', res.data.statusStr);
            customerStatus = res.data.statusStr
            that.setData({
              customerStatus: res.data.statusStr
            })
            console.log(that.data.customerStatus)
          }
        }
      })
    }
  },

  cancel_order: function (e) {
    console.log(e.target)
    var orderId=e.target.dataset.orderid;
    console.log(orderId)
    wx.showModal({
      title: '提示',
      content: '确定取消此订单',
      success: function(res){
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          wx.request({
            url: api.cancelOrder,
            data:{
              orderId:orderId,
              openId:openId,
              systemVersion: systemVersion
              //unionId: unionId
            },
            success:function(res){
              var res = res.data
              console.log(res)
              if (res.code == 0) {

              } else {
                tip.tip_msg(that, res.message)
              }
            }
          })
        }
      }
    })
  },
  goIndex: function(){
    wx.switchTab({
      url: '../../index/index/index',
    })
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

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