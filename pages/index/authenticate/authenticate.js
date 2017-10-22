// pages/index/authenticate/authenticate.js
const tip = require('../../../utils/tip');
const api = require('../../../utils/api');
var openId;
var customerStatus;
var unionId;
var systemVersion
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: ["项目经理", "市场经理", "产品经理", "设计师", "采购", "其他"],
    roleEnglish: ["project", "market", "product", "stylist", "purchase", "other"],
    "type": "personage",
    role_index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    unionId = wx.getStorageSync('unionId');
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
  radioChange: function (e) {
    var that = this;
    console.log(e.detail.value)
    if (e.detail.value == "personage") {
      console.log("个人")
      that.setData({
        type: "personage",
        // role: ["高级项目经理", "设计师", "其他"]
      })
    } else {
      console.log("企业")
      that.setData({
        type: "enterprise",
        // role: ["装修公司"]

      })
    }
    console.log(that.data.type)
  },
  roleChange: function (e) {
    console.log(e)
    console.log(e.detail.value)
    var value = e.detail.value;
    console.log(value)
    this.setData({
      role_index: value,
    })
  },
  addIdImg: function () {
    let that = this
    let IDimg = that.data.IDimg;
    let count = 2;
    if (IDimg && IDimg.length == 1) {
      count = 1;
    }
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        console.log(that.data.IDimg)
        if (IDimg) {
          console.log("增加图片")
          that.setData({
            IDimg: IDimg.concat(tempFilePaths)
          })
          console.log(that.data.IDimg)
        } else {
          console.log("没有图片")
          that.setData({
            IDimg: tempFilePaths
          })
        }

      }
    })
  },
  //删除身份证图片
  deleteID: function (e) {
    console.log(e.target.dataset.index)
    let that = this;
    let index = e.target.dataset.index;
    console.log(that.data.IDimg)
    that.data.IDimg.splice(index, 1);
    console.log(that.data.IDimg)
    that.setData({
      IDimg: that.data.IDimg
    })
  },
  //提交
  commit: function (res) {
    let that = this;
    let systemVersion = getApp().globalData.systemVersion; 
    console.log(systemVersion)
    let value = res.detail.value;
    let type = that.data.type;
    let role;
    let data;
    //个人
    if (type == "personage") {
      let role_index = that.data.role_index;
      role = that.data.roleEnglish[role_index];
      if (value.name == "") {
        tip.tip_msg(that, "请输入姓名");
        return;
      }
      // else {
      //   let reg = /[^\u4E00-\u9FA5 A-Z]/g;
      //   if(reg.test(value.name)===false) {
      //     tip.tip_msg(that, "请输入中文姓名");
      //     return;
      //   }
      // }
      if (value.identity == "") {
        tip.tip_msg(that, "请输入身份证号");
        return;
      } else {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(value.identity) === false) {
          tip.tip_msg(that, "请输入正确的身份证号");
          return;
        }
      }

      data = {
        openId: openId,
        customerType: "personage",
        role: role,
        name:value.name,
        identity: value.identity,
        systemVersion: systemVersion

      }
      console.log(data)
    } else {
      //企业
      console.log(value)
      if (value.companyName == "") {
        tip.tip_msg(that, "请输入企业名称");
        return;
      }
      if (value.license == "") {
        tip.tip_msg(that, "请输入统一社会信用代码");
        return;
      }
      data = {
        openId: openId,
        customerType: "enterprise",
        companyName: value.companyName,
        license: value.license,
        systemVersion: systemVersion
      }
    }
    console.log(data)

    wx.request({
      url: api.submitCustomerInfo,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == "0") {
          tip.tip_msg(that, "提交成功")
         setTimeout(function(){
           wx.navigateBack({
             delta: 1
           })
         },500)
        } else {
          tip.tip_msg(that, res.data.message)
        }
      }
    })

    //let IDImg = that.data.IDimg
    //console.log(IDImg)
    // if (!IDImg || IDImg.length < 2) {
    //   tip.tip_msg(that, "请上传身份证明")
    //   return;
    // }

    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
    //   filePath: IDImg,
    //   name: 'IDImg',
    //   formData: {
    //     'user': 'test'
    //   },
    //   success: function (res) {
    //     var data = res.data
    //     //do something
    //   }
    // })



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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})