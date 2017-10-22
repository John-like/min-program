// pages/user_center/user_data/user_data.js
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
    //   name:'皮皮虾',
    //   mobile:'18888888888',
    //   companyName:'喵星人',
    //   email:'888888888@qq.com',
    //   customerType:'项目经理'
    // },
    editor:false
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
    if(openId) {
      wx.getUserInfo({
        success: function (res) {
          var wx_user = {};
          wx_user.portrait = res.userInfo.avatarUrl;
          wx_user.name = res.userInfo.nickName;

          that.setData({
            wx_user: wx_user,
          })
          console.log(that.data.customerStatus)
        }
      })
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
          console.log(openId)
          console.log(customerStatus)
          console.log(res)
          var res = res.data;
          if (res.code == 0) {
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

  editor: function(){
    var that=this;
    var currentEditor=this.data.editor;
    if(!currentEditor) {
      this.setData({
        editor: true
      })
    }else {
      //that.close_editor()
      console.log("2222")
    }
    
    
  },
  // 判断输入的邮箱格式,并退出编辑状态
  close_editor: function(e){
    var that=this;
      var emailValue=e.detail.value
      var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
      if (!reg.test(emailValue)){
        tip.tip_msg(that, "输入格式不正确");
        that.setData({
          user: that.data.user
        })
      }else {
        that.data.user.email=emailValue;
        
        that.setData({
          editor:false,
          user:that.data.user
        })
      }
  },
  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
})