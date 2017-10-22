// page/component/pages/goods-detail/goods-detail.js

const api = require('../../../utils/api');
const tip = require('../../../utils/tip');
const common = require('../../../utils/common.js');
var openId;
var customerStatus;
var unionId;
var shopingCartPageIndex;
var shareMessageArg = {};
var allPage;
var optionid;
var ServenoneNum;
var heightnoneNum;
var systemVersion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//是否显示面板指示点
    indicatorColor: "#b8b2a9", //指示点颜色
    indicatorActivecolor: "#fff", //当前选中的指示点颜色
    autoplay: true,//是否自动切换
    interval: 5000,//自动切换时间间隔
    duration: 1000,//滑动动画时长
    colorNav: 1,//商品颜色选择
    colorIndex: 0,
    typeNav: 1,//商品型号选择
    typeIndex: 0,
    showModalStatus: false, //选择商品型号的时候，显示的遮层
    shopCarnum: 1,
    shopCarTotalPrice: 0,
    categoryNum: 0,
    shopCarVipTotalPrice: 0,
    shopCarServePrice: 0,
    goodsContent: {},
    isScroll: true,
    retailPrice: 0, //商品单价

     showModalStatus: false, //遮层控制显示隐藏

    addShopModal: false,//添加商品 控制

    shopCarModal: false, //购物车弹窗 控制
    heightnone: "", //属性显示隐藏
    Servenone: "" //服务显示隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shareMessageArg = options;
    console.log(shareMessageArg)
    systemVersion = getApp().globalData.systemVersion
    var that = this
    optionid = options.id;
    var optionprice = options.price;
    console.log(optionprice)
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    console.log(customerStatus)
    that.setData({
      customerStatus: customerStatus
    })
    unionId = wx.getStorageSync('unionId');
    // 商品详情
    if (openId) {
      wx.request({
        url: api.getInfoById,
        method: 'GET',
        data: {
          openId: openId,
          unionId: unionId,
          id: optionid,
          systemVersion: systemVersion
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
           console.log(res.data.data)
          var imageTurn = res.data.data.commodityImageTurns; //图片轮播
          var imageTurnarr = [];
          if (imageTurn != undefined) {
            for (var i = 0; i < imageTurn.length; i++) {
              imageTurnarr.push(imageTurn[i].fileUrl);
            }
          }
          var imageDetail = res.data.data.commodityImageDetail;//图片详情
          var imageDeatilarr = [];
          if (imageDetail != undefined) {
            for (var i = 0; i < imageDetail.length; i++) {
              imageDeatilarr.push(imageDetail[i].fileUrl);

            }
          }
          console.log(res.data.data)
          that.setData({
            goodsContent: res.data.data,
            previamgeDeatil: imageDeatilarr,
            previamgeTurn: imageTurnarr,
            retailPrice: res.data.data.price
          })
        }

      })

    }

    //查询购物车商品数量
    wx.request({
      url: api.queryCommodityNumFromShoppingCart,
      data: {
        openId: openId,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == "0") {
          that.setData({
            shopCarnum: res.data.data.commodityNum,
            shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
            shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
            categoryNum: res.data.data.commodityCount,
            shopCarServePrice: res.data.data.shoppingCartServeMoney
          })
        } else {
          tip.tip_msg(that, res.data.message)
        }
      }
    })

  },
  // 详情预览
  previamgeDeatil: function () {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: this.data.previamgeDeatil // 需要预览的图片http链接列表
    })
  },
  // 轮播预览
  previamgeTurn: function () {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: this.data.previamgeTurn // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    systemVersion = getApp().globalData.systemVersion
    wx.request({
      url: api.queryCommodityNumFromShoppingCart,
      data: {
        openId: openId,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == "0") {
          that.setData({
            shopCarnum: res.data.data.commodityNum,
            shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
            shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
            categoryNum: res.data.data.commodityCount,
            shopCarServePrice: res.data.data.shoppingCartServeMoney
          })
        } else {
          tip.tip_msg(that, res.data.message)
        }
      }
    })
    //如果购物车弹窗是打开状态,设置隐藏
    if (that.data.shopCarModal) {
      that.setData({
        shopCarModal: false,
        showModalStatus: false
      })
    }
  },


  //商品选择 颜色处理函数
  switchColor: function (e) {
    var that = this;
    let colorid = e.target.dataset.id;
    console.log(colorid);
    that.setData({
      colorId: colorid
    })
  },
   //商品选择 动态属性处理函数
  radioCheckedChange: function (e) {

    var that = this;
    var NavNum = that.data.NavNum
    var nameIndex = e.target.dataset.name
    var valueIndex = e.detail.value
    NavNum[nameIndex] = valueIndex
    that.setData({
      NavNum: NavNum
    })

  },

  //点击购物车显示购物车列表
  addBtn: function (e) {
    var that = this;
    shopingCartPageIndex = 1;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    var dataId = e.currentTarget.dataset.id;
    console.log(showThis)
    common.common(currentStatu, that, 200, showThis);
    if (showThis == "shopCarModal") {
      shopingCartPageIndex = 1;
      console.log(openId)
      console.log(shopingCartPageIndex)
      that.getShoppingList(that);
      that.setData({
        isScroll: false
      })
    } else {
      that.setData({
        isScroll: true
      })
    }

  },
   //弹出 商品 型号，颜色，规格选择框
  showGoodchose: function (e) {
    var that = this;
    that.checkboxChange(e)
    console.log(e.currentTarget.dataset)
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    var dataId = e.currentTarget.dataset.id;
    if(showThis) {
      that.setData({
        chooseNum: 1
      })
    }
    wx.request({
      url: api.commotifyPropertyById,
      method: 'GET',
      data: {
        openId: openId,
        //unionId: unionId,
        id: dataId,
        systemVersion: systemVersion
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        //判断是否有颜色
        if (res.data.data.color.length != 0) {

          var colorId = res.data.data.color[0].id
        } else {

          colorId = "";
        }
        //判断是否有材料材质
        if (res.data.data.material.length != 0) {

          var materialId = res.data.data.material[0].id
        } else {

          materialId = "";
        }
        //判断是否 有类型
        if (res.data.data.attribute.length != 0) {
          var attriBute = res.data.data.attribute;
          var length = attriBute.length;
          var NavNum = [];
          var NavId = [];
          for (let i = 0; i < length; i++) {
            NavNum.push(0);
            NavId.push(0);
          };
          that.setData({
            NavNum: NavNum,
            NavId: NavId,
          })

        } else {
          attriBute = "";
        }
        console.log(NavId)
        that.setData({
          goodsChose: res.data.data,
          attriBute: res.data.data.attribute,
          paidService: res.data.data.paidService,
          NavNum: NavNum,
          shopId: dataId,
          NavId: NavId,//属性id
          colorId: colorId,//颜色id 颜色 初始化
          materialId: materialId //材料材质id
        })
        common.common(currentStatu, that, 200, showThis);
      }
    })



  },
   //添加到购物车
  formSubmit: function (e) {
    var that = this;
    
    var formRes = {
      commodityId: that.data.goodsChose.commodityId,
      "number": that.data.chooseNum,
      attribute: [],
      serve: [],
      productColorId: "",
      materialId: "",
    }
    console.log(formRes)
    console.log(that.data.goodsChose)
    console.log(that.data.NavNum);

    console.log(that.data.attriBute)

    //如果有颜色属性
    if (that.data.colorId) {
      formRes.productColorId = that.data.colorId
    }
    //如果有材料材质
    if (that.data.materialId) {
      formRes.materialId = that.data.materialId
    }
    //如果有其它属性
    var attrArr = that.data.NavNum

    if (!!attrArr) {
      attrArr.forEach((item, index) => {
        let attrItem = that.data.attriBute[index];
        formRes.attribute.push({
          // attributeName: attrItem.name,
          // attributeValueName: attrItem.AttributeValue[item].name
          attributeValueId: attrItem.AttributeValue[item].id
        })
      })
    }
    //如果有付费服务

    if (that.data.paidService.length > 0) {
      //如果有选择付费服务
      let shopCheck = that.data.shopCheck
      if (shopCheck) {
        shopCheck.forEach((item, index) => {
          let attrItem = that.data.attriBute[index];
          formRes.serve.push({
            serveId: item
          })
        })
      }
    }

    formRes.openId = openId;
    formRes.attribute = JSON.stringify(formRes.attribute);
    formRes.serve = JSON.stringify(formRes.serve);
    formRes.systemVersion=systemVersion
    wx.request({
      url: api.addCommodityToShoppingCart,
      method: 'POST',
      data: formRes,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        console.log(openId)
        var resCode = res.data.code
        console.log(resCode)
        if (resCode != 0) {
          tip.tip_msg(that, res.data.message)
        }
        // that.setData({
        //   shopCarnum: 1
        // })
        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId,
            systemVersion: systemVersion
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == "0") {
              that.setData({
                shopCarnum: res.data.data.commodityNum,
                shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                categoryNum: res.data.data.commodityCount,
                shopCarServePrice: res.data.data.shoppingCartServeMoney
              })
            } else {
              tip.tip_msg(that, res.data.message)
            }
          }
        })
      }
    })

  },
  // checkbox
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var that = this;
    that.setData({
      shopCheck: e.detail.value
    })

  },
  // 购物车页面数量控制 增加
  shopCarnumAdd: function (e) {
    var that = this;
    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表

    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index

    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id

    let currentNum = shoppingcartLists[currentIndex].number + 1;

    if (shoppingcartLists[currentIndex].number >= 999) {
      tip.tip_msg(that, "单个添加数量已达上限")
      return;
    }

    wx.request({
      url: api.updateNumFromShoppingCart,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        shoppingCartItemId: changeNumId,
        unionId: unionId,
        num: currentNum,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res)
        that.getShoppingList(that)
        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId,
            systemVersion: systemVersion
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == "0") {
              that.setData({
                shopCarnum: res.data.data.commodityNum,
                shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                categoryNum: res.data.data.commodityCount,
                shopCarServePrice: res.data.data.shoppingCartServeMoney
              })
            } else {
              tip.tip_msg(that, res.data.message)
            }
          }
        })
      }
    })

  },
  // 购物车页面数量控制 减少
  shopCarnumReduce: function (e) {
    var that = this;
    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表
    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index
    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id
    let currentNum = shoppingcartLists[currentIndex].number - 1;
    console.log(currentNum)
    if (currentNum <= 0) {
      //删除购物车单一商品接口
      wx.request({
        url: api.removeCommodityFromShoppingCart,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openId: openId,
          shoppingCartItemIds: changeNumId,
          unionId: unionId,
          systemVersion: systemVersion
        },
        success: function (res) {
          that.getShoppingList(that)

          //查询购物车商品数量
          wx.request({
            url: api.queryCommodityNumFromShoppingCart,
            data: {
              openId: openId,
              systemVersion: systemVersion
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == "0") {
                that.setData({
                  shopCarnum: res.data.data.commodityNum,
                  shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                  shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                  categoryNum: res.data.data.commodityCount,
                  shopCarServePrice: res.data.data.shoppingCartServeMoney
                })
              } else {
                tip.tip_msg(that, res.data.message)
              }
            }
          })
        }
      })
    } else {
      wx.request({
        url: api.updateNumFromShoppingCart,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openId: openId,
          shoppingCartItemId: changeNumId,
          unionId: unionId,
          num: currentNum,
          systemVersion: systemVersion
        },
        success: function (res) {
          that.getShoppingList(that)

          //查询购物车商品数量
          wx.request({
            url: api.queryCommodityNumFromShoppingCart,
            data: {
              openId: openId,
              systemVersion: systemVersion
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == "0") {
                that.setData({
                  shopCarnum: res.data.data.commodityNum,
                  shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                  shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                  categoryNum: res.data.data.commodityCount,
                  shopCarServePrice: res.data.data.shoppingCartServeMoney
                })
              } else {
                tip.tip_msg(that, res.data.message)
              }
            }
          })
        }
      })
    }


  },
   //购物车页面数量  直接输入文字改变
  shopCarwritenum: function (e) {
    var that = this;
    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表

    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index

    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id

    let currentNum = e.detail.value;
    if (currentNum <= 0) {
      tip.tip_msg(that, "数量不能小于1哦！！");
    } else {
      wx.request({
        url: api.updateNumFromShoppingCart,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openId: openId,
          shoppingCartItemId: changeNumId,
          unionId: unionId,
          num: currentNum,
          systemVersion: systemVersion
        },
        success: function (res) {
          console.log(res)
          that.getShoppingList(that)

          //查询购物车商品数量
          wx.request({
            url: api.queryCommodityNumFromShoppingCart,
            data: {
              openId: openId,
              systemVersion: systemVersion
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == "0") {
                that.setData({
                  shopCarnum: res.data.data.commodityNum,
                  shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                  shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                  categoryNum: res.data.data.commodityCount,
                  shopCarServePrice: res.data.data.shoppingCartServeMoney
                })
              } else {
                tip.tip_msg(that, res.data.message)
              }
            }
          })
        }
      })
    }


  },
  //商品列表数量--
  goodsCarnumReduce: function () {
    var that = this;
    if (that.data.chooseNum == 1) {
      tip.tip_msg(that, "不能再减了");
      return;
    }
    if (that.data.shopCarnum > 0) {
      that.setData({
        chooseNum: that.data.chooseNum- 1
      })
    }
  },
  //商品数量++
  goodsCarnumAdd: function () {
    var that = this;
    if (this.data.chooseNum >= 999) {
      tip.tip_msg(that, "单个商品数量添加已达上限")
      return;
    }
    that.setData({
      chooseNum: that.data.chooseNum + 1
    })
  },
   //清空购物车
  clearShoppingCart: function () {
    var that = this;


    if (that.data.shoppingcartLists.length == 0) {
      tip.tip_msg(this, "已经没有商品了！！");
    } else {
      wx.showModal({

        content: '清空购物车?',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: api.clearShoppingCart,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                openId: openId,
                systemVersion: systemVersion
              },
              success: function (res) {
                console.log(res)
                that.setData({
                  shoppingcartLists: ""
                })

                //查询购物车商品数量
                wx.request({
                  url: api.queryCommodityNumFromShoppingCart,
                  data: {
                    openId: openId,
                    systemVersion: systemVersion
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.data.code == "0") {
                      that.setData({
                        shopCarnum: res.data.data.commodityNum,
                        shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                        shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                        categoryNum: res.data.data.commodityCount,
                        shopCarServePrice: res.data.data.shoppingCartServeMoney
                      })
                    } else {
                      tip.tip_msg(that, res.data.message)
                    }
                  }
                })
              }
            })

          } else if (res.cancel) {

          }
        }
      })

    }

  },
   //购物车删除单一商品
  shopCarRemove: function (e) {
    var that = this;
    let removeId = e.currentTarget.dataset.id
    wx.request({
      url: api.removeCommodityFromShoppingCart,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        shoppingCartItemIds: removeId,
        unionId: unionId,
        systemVersion: systemVersion
      },
      success: function (res) {
        that.getShoppingList(that)

        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId,
            systemVersion: systemVersion
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == "0") {
              that.setData({
                shopCarnum: res.data.data.commodityNum,
                shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                categoryNum: res.data.data.commodityCount,
                shopCarServePrice: res.data.data.shoppingCartServeMoney
              })
            } else {
              tip.tip_msg(that, res.data.message)
            }
          }
        })
      }
    })
  },
  //购物车下拉刷新事件
  shoppingCartPullDown: function () {
    console.log("到底啦")
    //this.getShoppingList();
  },
  //购物车请求列表事件
  getShoppingList: function (that) {
    wx.request({
      url: api.queryCommodityListFromShoppingCart,
      data: {
        openId: openId,
        systemVersion: systemVersion
      },
      success: function (res) {

        console.log(res)
        that.setData({
          shoppingcartLists: res.data.data.results,
        })
      }
    })
  },
   //失去焦点时自主选择商品数量
  chooseCommodityNum: function (e) {
    var that = this;
    that.data.chooseNum = e.detail.value;
    let blurValue = e.detail.value;
    if (blurValue == 0) {
      blurValue = 1;
      tip.tip_msg(that, "不能小于1哦")
    }
    that.setData({
      chooseNum: parseInt(e.detail.value),
      shopCarnum: parseInt(e.detail.value)
    })
  },
  getMeaun: function () {
    var that =this;
    //console.log(that.data.shoppingcartLists.length)

    wx.request({
      url: api.queryCommodityListFromShoppingCart,
      data: {
        openId: openId,
        systemVersion: systemVersion
      },
      success: function (res) {

        console.log(res)
        that.setData({
          shoppingcartLists: res.data.data.results,
          showShopCarready:true,
        })
        if (that.data.shoppingcartLists.length > 0) {
          wx.redirectTo({
            url: '../../order_manage/firm_order/firm_order'
          })
        } else {
          tip.tip_msg(that, "请先添加商品到购物车哦···");
        }
      }
    })
   
  },
  //转发options
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
  // 属性展开
  shopCarattributeMore: function (e) {
    if (heightnoneNum != e.target.dataset.id) {
      heightnoneNum = e.target.dataset.id;
    } else {
      heightnoneNum = "";
    }
    console.log(heightnoneNum)
    this.setData({
      heightnone: heightnoneNum
    })
  },

  // 服务展开
  shopCarServeMore: function (e) {
    if (ServenoneNum != e.target.dataset.id) {
      ServenoneNum = e.target.dataset.id;
    } else {
      ServenoneNum = "";
    }
    this.setData({
      Servenone: ServenoneNum
    })
  }

})

