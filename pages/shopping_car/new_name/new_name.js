// pages/shopping_car/new_name/new_name.js
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
    editor: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    if(options) {
      this.setData({
        user: options,
        editor: true
      })
    }
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

  formSubmit: function(res){
    var that=this;
    var res=res.detail.value;
    console.log(res)
    var reg_phone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if(res.name=='') {
      tip.tip_msg(that, "请输入用户名");
      return;
    }
    if(res.phone=='') {
      tip.tip_msg(that, "请输入手机号");
      return;
    } else if (!reg_phone.test(res.phone)) {
      tip.tip_msg(that, "请输入正确的手机号");
      return;
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      user: res
    })

    wx.navigateBack({
      delta: 1
    })
  },
  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
})