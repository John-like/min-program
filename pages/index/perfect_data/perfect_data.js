// pages/index/perfect_data/perfect_data.js
const tip = require('../../../utils/tip');
const api = require('../../../utils/api');
var openId;
var customerStatus;
var unionId;
var protocol=true;
var shareMessageArg = {};
var systemVersion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [{
      name: "first",
      data: ["人气", "价格", "销量"]
    }, {
      name: "second",
      data: ["111", "222", "333"]
    }],
    num: "num0",
    idx: 0,
    close: false,
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    shareMessageArg = options;
    var that = this;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    if(openId) {
      
    }
  },
  formSubmit: function (e) {
    console.log(e)
    var value = e.detail.value;
    console.log(value)
    if (value.name == "") {
      tip.tip_msg(this, "姓名不能为空")
      return;
    }
    var regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if (value.mobile == "") {
      tip.tip_msg(this, "手机号不能为空")
      return;
    } else if (!regMobile.test(value.mobile)) {
      tip.tip_msg(this, "请输入正确的手机格式");
      return;
    }
    if (value.code == "") {
      tip.tip_msg(this, "验证码不能为空")
      return;
    }
    if (!protocol) {
      tip.tip_msg(this, "请同意购买协议")
      return;
    }
    // if (value.companyName == "") {
    //   tip.tip_msg(this, "公司名称不能为空")
    //   return;
    // }
    var that = this;
    console.log(e.detail.value)
    console.log(customerStatus)
    console.log(openId)
    var formData = e.detail.value;
    formData.openId=openId;
    formData.systemVersion= systemVersion
    wx.request({
      url: api.submitCustomerInfo,
      method: 'POST',
      data: formData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        var data = res.data;
        console.log(res.data);
        if(data.code == 0) {
          customerStatus = 'approving';
          wx.setStorageSync('customerStatus', 'approving');
          that.setData({
            close: true
          })
        }
      }
    })
  },
  checkboxChange: function(e){
    console.log(e)
    if(e.detail.value.length==0) {
      protocol=false;
    }else {
      protocol=true;
    }
  },

  goIndex: function () {
    wx.switchTab({
      url: '../../index/index/index',
    })
  },
  view_protocol: function(){
    wx.previewImage({
      urls: ["https://go.jiaw.com/upload/3DAF509D5B9A317F3EAEAE45DD7F5D33.jpg"],
    })
   
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