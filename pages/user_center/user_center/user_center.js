// pages/component/user_center.js

const api = require('../../../utils/api');
const tip = require('../../../utils/tip');
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
    // user: {
    //   portrait: "../../../images/user_head.png",
    //   name: "奔跑吧皮皮虾"
    // },
    // examineStatus:{
    //   examine:true,
    //   status:"正在审核中"
    // }
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
    if (openId) {
      wx.getUserInfo({
        success: function (res) {
          var user = {};
          user.portrait = res.userInfo.avatarUrl;
          user.name = res.userInfo.nickName;

          that.setData({
            user: user,
          })
        }
      })
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

  /**生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
     systemVersion = getApp().globalData.systemVersion; 
    if (openId) {
      console.log(openId)
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
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.system)
          if (res.system.indexOf("Android")>=0) {
            that.setData({
              system:"android"
            })
          }
        }
      })
    }

  },
  //是否是审核状态 
  is_examine: function (res) {
    var that = this;
    var customerStatus = wx.getStorageSync('customerstatusStr');
    // customerStatus = "forArchives"
    var link = res.currentTarget.dataset.link
    var url;
  
    if (customerStatus == "unregister") {
      console.log("unregister")
      let content;
      if(link=="0") {
        content = '您需要先注册才能编写个人信息'
        // url = '../../user_center/user_data/user_data'        
      }else {
        content = '您需要注册并认证才能查看认证信息'        
        // url = '../../index/authenticate/authenticate'
      }
      wx.showModal({
        content: content,
        confirmText:'去注册',
        success: function (res) {
          if (res.confirm) { 
            wx.reLaunch({
              url: "../../index/index/index?arg=toRegistered",
              success: function () {
                console.log("进入注册页面")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      // //审核通过,认证客户
      // if (link == "0") {
      //   //个人资料页面
      //   url = '../../user_center/user_data/user_data'
      // } else {
      //   //资质认证页面
      //   url = '../../user_center/user_certificate/user_certificate"'
      // }
     
    } else if (customerStatus == 'forArchives') {
      //已注册未认证

      //进入个人资料
      if(link=="0") {
        url = '../../user_center/user_data/user_data'
        wx.navigateTo({
          url: url,
          success: function () {
            console.log("进入注册页面")
          }
        })
      }else {
        wx.showModal({
          content: '您需要先认证才能查看认证信息？',
          confirmText:'去认证',
          success: function (res) {
            if (res.confirm) {
                //资质认证页面
                url = '../../index/authenticate/authenticate'
              wx.navigateTo({
                url: url,
                success: function () {
                  console.log("进入注册页面")
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }else {
      //注册并认证
      if (link == "0") {
        //个人资料页面
         url = '../../user_center/user_data/user_data'
      } else {
        //资质认证页面
        url = '../../user_center/user_certificate/user_certificate'
      }
      wx.navigateTo({
        url: url,
        success: function () {
          console.log("进入注册页面")
        }
      })
    }
  },
  showVIP: function(e){
    let that=this
    console.log(e.detail.value)
    let value = e.detail.value;
    that.setData({
      value:value
    })
    if(value.length==0) {

    }else {

    }


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
  //联系客服
  concat: function () {
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //       wx.makePhoneCall({
    //         phoneNumber: '4008208369'
    //       })
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    wx.makePhoneCall({
      phoneNumber: '4008208369'
    })
   
  }
})