// pages/user_center/user_add_address/user_add_address.js
const api = require('../../../utils/api');
const tip = require("../../../utils/tip.js");

var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var areaAll;
var loc_data = [0, 0, 0];
var curr_loc = [0, 0, 0];
var systemVersion;
var area_total = {
  country: [],
  province: [],
  city: [],
  area: []
};
var area_name = {
  province: [],
  city: [],
  area: []
};
var form_address = {};
var addressId;  //修改的地址ID

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // address: {
    //   name: "皮皮虾",
    //   mobile: "18888888888",
    //   address: '上海市宜山路450号家饰佳1楼G1033-G1035展厅上海市宜山路450号家饰佳1楼G1033-G1035展厅',
    //   provinceId: '2',
    //   provinceName: '上海',
    //   cityId: '3',
    //   cityName: '上海市',
    //   areaId: '9',
    //   areaName: '黄浦区'
    // },
    placeholder: true,
    click_disabled: false,
    show_location: false,
    modify: false,
    value: [1, 0, 0],
    textDisabled:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    addressId = options.id || undefined;
    var that = this;
    systemVersion = getApp().globalData.systemVersion
    shareMessageArg = options;
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    unionId = wx.getStorageSync('unionId');
    areaAll = wx.getStorageSync('areaAll');
    if(openId) {
      //没有缓存重新获取
      if (!areaAll) {
        //获取省市区数据
        wx.request({
          url: api.getAreaAll,
          method: 'GET',
          data: {
            openId: openId,
            systemVersion: systemVersion
            //unionId:unionId
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            let res_area = res.data;

            if (res_area.code == 0) {
              let arr = res_area.data.results;
              console.log(arr)
              var country = []
              var province = []
              var city = []
              var area = []

              for (let value of arr) {
                if (value.Type == "country") {
                  area_total.country.push(value)
                } else if (value.Type == "province") {
                  area_total.province.push(value)
                } else if (value.Type == "city") {
                  area_total.city.push(value)
                } else if (value.Type == "area") {
                  area_total.area.push(value)
                }
              }
              areaAll = {
                "country": country,
                "province": province,
                "city": city,
                "area": area
              }
              wx.setStorageSync('areaAll', areaAll);
            } else {
              tip.tip_msg(that, res.errMsg);
            }
          }
        })
      }
      //如果是修改地址

      if (addressId) {
        console.log("进入修改地址")
        //初始化地址数据
        wx.request({
          url: api.getAddressDetail,
          data: {
            openId: openId,
            systemVersion: systemVersion,
            //unionId:unionId,
            customerAddressId: addressId
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 0) {
              that.setData({
                address: res.data.data
              })
              console.log(that.data.address)
              //根据初始化的id设置省市区
              var value = [];
              area_total = {
                country: [],
                province: [],
                city: [],
                area: []
              };
              area_name = {
                province: [],
                city: [],
                area: []
              };
              var address = that.data.address
              console.log(area_name)
              for (let value of areaAll.province) {
                if (value.parentId == "1") {
                  area_total.province.push(value)
                  area_name.province.push(value.name)
                }
              }
              var provinceIndex = that.isHasElement(area_name.province, address.provinceName)
              value.push(provinceIndex)
              var province_first_id = address.provinceId;
              for (let value of areaAll.city) {
                if (value.parentId == province_first_id) {
                  area_total.city.push(value)
                  area_name.city.push(value.name)
                }
              }
              var city_first_id = address.cityId;
              var cityIndex = that.isHasElement(area_name.city, address.cityName)
              value.push(cityIndex)
              for (let value of areaAll.area) {
                if (value.parentId == city_first_id) {
                  area_total.area.push(value)
                  area_name.area.push(value.name)
                }
              }
              var areaIndex = that.isHasElement(area_name.area, address.areaName)
              value.push(areaIndex)
              console.log(area_total)
              that.setData({
                area_total: area_total,
                area_name: area_name,
                value: value
              })
            } else {
              tip.tip_msg(that, res.data.message)
            }

          }
        })
      } else {
        //新增地址时,初始化省市区
        area_total = {
          country: [],
          province: [],
          city: [],
          area: []
        };
        area_name = {
          province: [],
          city: [],
          area: []
        };
        for (let value of areaAll.province) {
          if (value.parentId == "1") {
            area_total.province.push(value)
            area_name.province.push(value.name)
          }
        }
        var province_first_id = area_total.province[0].id
        for (let value of areaAll.city) {
          if (value.parentId == province_first_id) {
            area_total.city.push(value)
            area_name.city.push(value.name)
          }
        }
        var city_first_id = area_total.city[0].id
        for (let value of areaAll.area) {
          if (value.parentId == city_first_id) {
            area_total.area.push(value)
            area_name.area.push(value.name)
          }
        }

        this.setData({
          area_total: area_total,
          area_name: area_name
        })
      }

    }
  },

  //提交数据
  formSubmit: function (res) {
    var that = this;
    var userInfo = res.detail.value
    console.log(res)
    if (userInfo.name == '') {
      var message = "请输入收货人姓名"
      tip.tip_msg(this, message);
      return;
    }
    var mobile = userInfo.mobile;
    var regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if (mobile == '') {
      tip.tip_msg(this, "请输入收货人电话");
      return;
    } else if (!regMobile.test(mobile)) {
      tip.tip_msg(this, "请输入正确的手机格式");
      return;
    } else if (!(that.data.new_address || this.data.address)) {
      tip.tip_msg(this, "请选择所在地区");
      return;
    }
    if (userInfo.address == '') {
      tip.tip_msg(this, "请输入收货人地址")
      return;
    }

    var res_data = {};
    res_data.openId = openId;
    //res_data.unionId = unionId;
    res_data.provinceId = form_address.provinceId || this.data.address.provinceId
    res_data.cityId = form_address.cityId || this.data.address.cityId
    res_data.areaId = form_address.areaId || this.data.address.areaId
    res_data.address = userInfo.address
    res_data.name = userInfo.name
    res_data.mobile = userInfo.mobile
    res_data.isDefault = "no"


    console.log(res_data)
    if (addressId) {
      res_data.isDefault = that.data.address.isDefault
      res_data.customerAddressId = addressId
      res_data.version = that.data.address.version
      res_data.systemVersion = systemVersion
      //修改地址
      wx.request({
        url: api.updateAddress,
        method: 'POST',
        data: res_data,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res_data)
          console.log(res)
          that.go_backPage()
        }
      })

    } else {
      //添加地址
      console.log("添加地址")
      wx.request({
        url: api.addAddress,
        method: 'POST',
        data: res_data,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var res = res.data;
          console.log(res)
          console.log(res_data)
          if (res.code == 0) {
            that.go_backPage()

          } else {
            tip.tip_msg(that, res.message);
          }
        }
      })

    }

  },
  change: function (res) {
    if (res.detail.value == '') {
      this.setData({
        placeholder: true
      })
    } else {
      this.setData({
        placeholder: false
      })
    }
  },

  province_change: function (res) {
    var that = this;
    var res = res.detail.value
    this.setData({
      province_res: this.data.province[res]
    })
  },
  // 滚动改变地区时,替换省市区数据
  bindChange: function (res) {
    var that = this;
    var last_loc = curr_loc;
    curr_loc = res.detail.value;
    console.log(res.detail.value)
    if (last_loc[0] != curr_loc[0]) {
      //改变了省
      let index = curr_loc[0]
      let id = area_total.province[index].id;
      this.change_province(id)
    } else if (last_loc[1] != curr_loc[1]) {
      //改变了市
      let index = curr_loc[1]
      let id = area_total.city[index].id;
      this.change_city(id)
    }
  },
  //点击所在地区弹出设置界面
  set_location: function () {
    this.setData({
      show_location: true,
      textDisabled:true
    })
  },
  //点击确定设置所在地区
  get_location: function (res) {
    console.log(curr_loc)
    console.log(area_name)
    console.log(area_total)
    let new_address = this.data.new_address || {};
    new_address.provinceName = area_name.province[curr_loc[0]]
    new_address.cityName = area_name.city[curr_loc[1]]
    new_address.areaName = area_name.area[curr_loc[2]]
    form_address.provinceId = area_total.province[curr_loc[0]].id
    form_address.cityId = area_total.city[curr_loc[1]].id
    form_address.areaId = area_total.area[curr_loc[2]].id
    this.setData({
      show_location: false,
      new_address: new_address,
      textDisabled:false
    })
  },
  //点击取消关闭设置界面
  cancel: function () {
    this.setData({
      show_location: false,
      textDisabled: false
    })
  },
  // 改变省时,更新地址数据
  change_province: function (id) {
    area_name.city = [];
    area_name.area = [];
    area_total.city = [];
    area_total.area = [];
    for (let value of areaAll.city) {
      if (value.parentId == id) {
        area_total.city.push(value)
        area_name.city.push(value.name)
      }
    }
    var city_first_id = area_total.city[0].id
    for (let value of areaAll.area) {
      if (value.parentId == city_first_id) {
        area_total.area.push(value)
        area_name.area.push(value.name)
      }
    }

    this.setData({
      area_total: area_total,
      area_name: area_name
    })
  },
  //改变市时,更新地址数据
  change_city: function (id) {
    area_name.area = [];
    area_total.area = [];

    for (let value of areaAll.area) {
      if (value.parentId == id) {
        area_total.area.push(value)
        area_name.area.push(value.name)
      }
    }

    this.setData({
      area_total: area_total,
      area_name: area_name
    })
  },
  isHasElement: function (arr, value) {
    var str = arr.toString();
    var index = str.indexOf(value);
    if (index >= 0) {
      //存在返回索引 
      //"(^"+value+",)|(,"+value+",)|(,"+value+"$)" 
      value = value.toString().replace(/(\[|\])/g, "\\$1");
      var reg1 = new RegExp("((^|,)" + value + "(,|$))", "gi");
      return str.replace(reg1, "$2@$3").replace(/[^,@]/g, "").indexOf("@");
    } else {
      return -1;//不存在此项 
    }
  },
  go_backPage: function () {
    var that=this;
    wx.request({
      url: api.getAddressItem,
      method: 'GET',
      data: {
        openId: openId,
        systemVersion: systemVersion
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var res = res.data;
        if (res.code == 0) {

          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面

          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            lists: res.data.results,
            pagination: res.data.pagination
          })
          console.log(res.data.results)
          wx.navigateBack({
            delta: 1
          })
        } else {
          //tip.tip_msg(that, res.message);
        }
      }
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