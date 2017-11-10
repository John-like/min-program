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
    userName: "",
    saveEnterpriseName: "",
    IDimg_front: [],
    IDimg_reverse: [],
    IDimg_enterprise: []
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
  //失去焦点时保存用户姓名
  saveNameInput: function (e) {
    var that = this;
    var userName = e.detail.value;
    that.setData({
      userName: userName
    })
  },
  //失去焦点时保存企业名称
  saveEnterpriseName: function (e) {
    var that = this;
    var saveEnterpriseName = e.detail.value;
    that.setData({
      saveEnterpriseName: saveEnterpriseName
    })
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
  addIdImg: function (e) {
    let aspect = e.target.dataset.aspect;
    console.log(aspect);
    let that = this;
    let IDimg = that.data.IDimg;
    console.log(IDimg);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        console.log(that.data.IDimg)
        if (IDimg) {
          console.log("增加多张图片")
          // that.setData({
          //   IDimg: IDimg.concat(tempFilePaths)
          // })
          // console.log(that.data.IDimg)
        } else {
          console.log("第一次增加图片")
          if (aspect=="front") {
            that.setData({
              IDimg_front: tempFilePaths
            })
            that.uploadImage(tempFilePaths, "front")
          } else if (aspect=="reverse") {
            that.setData({
              IDimg_reverse: tempFilePaths
            })
            that.uploadImage(tempFilePaths, "reverse")
          } else if (aspect =="enterprise") {
            that.setData({
              IDimg_enterprise: tempFilePaths
            })
            that.uploadImage(tempFilePaths, "enterprise")
          }
        }
        
      }
    })
  },
  //上传附件调用
  uploadImage: function (filePath,aspect) {
    var that = this;
    wx.uploadFile({
      url: api.uploadFile,
      filePath: filePath[0],
      name: 'file',
      formData: {
        openId: openId,
        systemVersion: systemVersion,
        fileType: 'image'
      },
      success: function (res) {
        console.log(res);
        var data = JSON.parse(res.data);
        console.log(data.id)
        if(aspect == "front") {
          that.setData({
            IDimg_front_id: data.id
          })
        } else if (aspect == "reverse") {
          that.setData({
            IDimg_reverse_id: data.id
          })
        } else if (aspect == "enterprise") {
          that.setData({
            IDimg_enterprise_id: data.id
          })
        }
      }
    })
  },
  //删除身份证图片
  deleteID: function (e) {
    let that = this;
    let index = e.target.dataset.index;
    let aspect = e.target.dataset.aspect;
    console.log(aspect);
    if (aspect == "front") {
      that.data.IDimg_front.splice(index, 1);
      that.setData({
        IDimg_front: that.data.IDimg_front
      })
      console.log(that.data.IDimg_front)
    } else if (aspect == "reverse") {
      that.data.IDimg_reverse.splice(index, 1);
      that.setData({
        IDimg_reverse: that.data.IDimg_reverse
      })
    } else if (aspect == "enterprise") {
      that.data.IDimg_enterprise.splice(index, 1);
      that.setData({
        IDimg_enterprise: that.data.IDimg_enterprise
      })
    }
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
      console.log(role);
      if (value.name.trim() == "") {
        tip.tip_msg(that, "请输入姓名");
        return;
      } else if (this.data.IDimg_front.length == 0) {
        tip.tip_msg(that, "请上传身份证正面");
        return;
      } else if (this.data.IDimg_reverse.length == 0) {
        tip.tip_msg(that, "请上传身份证反面");
        return;
      }
      // else {
      //   let reg = /[^\u4E00-\u9FA5 A-Z]/g;
      //   if(reg.test(value.name)===false) {
      //     tip.tip_msg(that, "请输入中文姓名");
      //     return;
      //   }
      // }
      // if (value.identity == "") {
      //   tip.tip_msg(that, "请输入身份证号");
      //   return;
      // } else {
      //   let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      //   if (reg.test(value.identity) === false) {
      //     tip.tip_msg(that, "请输入正确的身份证号");
      //     return;
      //   }
      // }

      data = {
        openId: openId,
        customerType: "personage",
        role: role,
        name: value.name,
        // identity: value.identity,
        systemVersion: systemVersion,
        identityFrontFileId: this.data.IDimg_front_id,
        identityBackFileId: this.data.IDimg_reverse_id
      }
      console.log(data)
      console.log(this.data.IDimg_front_id, this.data.IDimg_reverse_id)
    } else {
      //企业
      console.log(value)
      if (value.companyName.trim() == "") {
        tip.tip_msg(that, "请输入企业名称");
        return;
      } else if (this.data.IDimg_enterprise.length == 0) {
        tip.tip_msg(that, "请上传营业执照");
        return;
      }
      // if (value.license == "") {
      //   tip.tip_msg(that, "请输入统一社会信用代码");
      //   return;
      // }
      data = {
        openId: openId,
        customerType: "enterprise",
        companyName: value.companyName,
        // license: value.license,
        systemVersion: systemVersion,
        licenseFileId: this.data.IDimg_enterprise_id
      }
    }
    console.log(this.data.IDimg_enterprise_id)
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

  },
  readProtocal: function (e) {
    console.log(e)
    wx.previewImage({
      urls: ["https://img.jiaw.com/%E4%BC%9A%E5%91%98%E6%9D%83%E7%9B%8A.png"],
    })
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

  },
  previewPhoto: function (e) {
    console.log(e.target.dataset.img_url);
    let url1 = e.target.dataset.img_url;
    wx.previewImage({
      urls: [url1]
    })
  }
})