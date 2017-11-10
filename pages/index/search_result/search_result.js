// pages/index/search_result/search_result.js
const common = require('../../../utils/common.js');
const api = require('../../../utils/api');
const tip = require('../../../utils/tip');
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var shopingCartPageIndex;
var ServenoneNum;
var heightnoneNum;
var overtime = true;
var updataNumTimer = null;
var reduceNumTimer = null;
var shoppingGoodsNum = 0;
var shoppingGoodsNumReduce = 0;
var lastshoppingGoodsNum = 0;
var pageIndex = 1;
var allPage;
var systemVersion;
var brand_result = [];//品牌筛选结果
var lowerPrice = "";
var uperPrice = "";
var search_focus;//聚焦时搜索的内容
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_value: "斯米克瓷砖",
    showModalStatus: false, //遮层控制显示隐藏
    addShopModal: false,//添加商品 控制
    shopCarModal: false, //购物车弹窗 控制
    filterModal: false,  //筛选弹窗
    colorIndex: 0, //控制 颜色显示隐藏
    mask_show: false,  //弹层显示
    overtime: false,  //连接超时
    shopCarnum: 1,  //选规格弹窗中的商品数量
    bottom_show: false,
    screenLock: true,//筛选初始没有选中任何值
    delete_search_show: false, //聚焦时显示删除icon
    search_focus_control:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shareMessageArg = options;
    var that = this

    console.log(options)
    systemVersion = getApp().globalData.systemVersion
    that.setData({
      searchContent: options.search_content,
      search_content: options.search_content,
      search_placeholder: options.search_content
    })
    // var optionsnum = parseInt(options.id);
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    unionId = wx.getStorageSync('unionId');
    // wx.request({
    //   url: api.getCommodityByCategoryId,
    //   method: 'GET',
    //   data: {
    //     openId: openId,
    //     //unionId: unionId,
    //     productCategoryId: 3,
    //     pageIndex: pageIndex
    //   },
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //     overtime = false;
    //     // clearTimeout(timer)
    //     console.log(res)
    //     var data = res.data.data.results;
    //     console.log(data)
    //     console.log(customerStatus)
    //     wx.hideLoading()
    //     that.setData({
    //       lists: res.data.data.results,
    //       // productCategoryId: optionsnum,
    //       customerStatus: customerStatus,
    //       overtime: false
    //     })
    //     allPage = res.data.data.pagination.allPage
    //   }
    // })
    pageIndex = 1;
    wx.request({
      url: api.queryCommodityByCondition,
      method: 'get',
      data: {
        openId: openId,
        //unionId: unionId,
        keywords: that.data.searchContent,
        pageIndex: pageIndex
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        pageIndex++
        console.log(res)
        overtime = false;
        // clearTimeout(timer)
        if (res.data.code == "0") {
          var data = res.data.results;
          console.log(data)
          console.log(customerStatus)
          wx.hideLoading()
          that.setData({
            lists: res.data.data.results,
            // productCategoryId: optionsnum,
            customerStatus: customerStatus,
            overtime: false
          })
          if (res.data.data.results.length == 0) {
            allPage = 0
            that.setData({
              allSize: 0
            })
          } else {
            allPage = res.data.data.pagination.allPage
            that.setData({
              allSize: res.data.data.pagination.allSize
            })
          }
        } else {
          tip.tip_msg(that, res.data.message)
        }

      }
    })

    //查询购物车商品数量
    // wx.request({
    //   url: api.queryCommodityNumFromShoppingCart,
    //   data: {
    //     openId: openId
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     if (res.data.code == "0") {
    //       that.setData({
    //         shopCarnum: res.data.data.commodityNum,
    //         shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
    //         shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
    //         categoryNum: res.data.data.commodityCount,
    //         shopCarServePrice: res.data.data.shoppingCartServeMoney
    //       })
    //     } else {
    //       tip.tip_msg(that, res.data.message)
    //     }
    //   }
    // })
  },

  /* 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },

  /** 生命周期函数--监听页面显示 */
  onShow: function () {
    let that = this
    systemVersion = getApp().globalData.systemVersion
    brand_result = [] //初始化品牌筛选结果
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
    //如果购物车弹窗是打开状态,设置隐藏
    if (that.data.shopCarModal) {
      that.setData({
        shopCarModal: false,
        showModalStatus: false
      })
    }
  },

  //弹出 商品 型号，颜色，规格选择框
  showGoodchose: function (e) {
    var that = this;
    console.log(e)
    that.checkboxChange(e)
    console.log(e.currentTarget.dataset)
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    var dataId = e.currentTarget.dataset.id;

    console.log(showThis)

    if (showThis) {
      that.setData({
        chooseNum: 1,
        paidService: []
      })
    }
    that.setData({
      mask_show: true
    })
    wx.request({
      url: api.commotifyPropertyById,
      method: 'GET',
      data: {
        openId: openId,
        //unionId: unionId,
        id: dataId
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
          formRes.serve.push({
            serveId: item
          })
        })
      }
    }
    formRes.openId = openId;
    formRes.attribute = JSON.stringify(formRes.attribute);
    formRes.serve = JSON.stringify(formRes.serve);

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
        console.log(formRes)
        // that.setData({
        //   shopCarnum: 1
        // })
        var resCode = res.data.code
        console.log(resCode)
        if (resCode != 0) {
          tip.tip_msg(that, res.data.message)
        }
        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId
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
  //点击遮罩层隐藏其他弹层
  addBtn: function (e) {
    var that = this;
    that.setData({
      filterModal: false,
      filter_type: false
    })
    shopingCartPageIndex = 1;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    var dataId = e.currentTarget.dataset.id;
    if (!showThis) {
      that.setData({
        mask_show: false
      })
    }
    common.common(currentStatu, that, 200, showThis);
    if (showThis == "shopCarModal") {
      shopingCartPageIndex = 1;
      console.log(openId)
      console.log(shopingCartPageIndex)
      that.getShoppingList(that);
      that.setData({
        mask_show: true
      })
    }



  },
  //点击下单
  getMeaun: function () {
    var that = this;
    getApp().TapFunc(function () {
      console.log(getCurrentPages()[getCurrentPages().length - 1].route)

//      console.log(that.data.shoppingcartLists.length)

      wx.request({
        url: api.queryCommodityListFromShoppingCart,
        data: {
          openId: openId,
        },
        success: function (res) {

          console.log(res)
          that.setData({
            shoppingcartLists: res.data.data.results,
            showShopCarready: true,
          })
          if (that.data.shoppingcartLists.length > 0) {
            wx.navigateTo({
              url: '../../order_manage/firm_order/firm_order',
              success: function () {

                console.log("链接成功")
              }
            })
          } else {
            tip.tip_msg(that, "请先添加商品到购物车哦···");
          }
        }
      })
    })

    //判断是否在当前页面
    //解决多次点击跳转多次页面
    // var current_route = getCurrentPages()[getCurrentPages().length - 1].route
    // if (current_route != "pages/index/optionalBag/optionalBag") {
    //   return;
    // }


  },
  // checkbox
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var that = this;
    that.setData({
      shopCheck: e.detail.value
    })
  },
  //购物车请求列表事件
  getShoppingList: function (that) {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.request({
      url: api.queryCommodityListFromShoppingCart,
      data: {
        openId: openId,
      },
      success: function (res) {
        console.log("获取列表成功")
        // wx.hideLoading()
        console.log(res)
        that.setData({
          shoppingcartLists: res.data.data.results,
        })
        console.log(that.data.shoppingcartLists)
      },
      fail: function () {
        // wx.hideLoading()
        console.log("网络异常")
      }
    })
  },
  // 购物车页面数量控制 增加
  shopCarnumAdd: function (e) {
    var that = this;
    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表

    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index

    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id

    //如果正在--,返回
    if (reduceNumTimer) {
      return;
    }
    //如果定时器不存在,首次点击加号
    if (!updataNumTimer) {

      shoppingGoodsNum = that.data.shoppingcartLists[currentIndex].number;
      lastshoppingGoodsNum = shoppingGoodsNum
      console.log("请求前的商品数量++" + lastshoppingGoodsNum)
    }
    // if (shoppingcartLists[currentIndex].number >= 999) {
    //   tip.tip_msg(that, "单个添加数量已达上限")
    //   return;
    // }
    shoppingGoodsNum++;
    if (shoppingGoodsNum > 999) {
      shoppingGoodsNum = 999;
      tip.tip_msg(that, "单个添加数量已达上限")
      return;
    }
    that.data.shoppingcartLists[currentIndex].number = shoppingGoodsNum;
    that.setData({
      shoppingcartLists: that.data.shoppingcartLists
    })
    console.log(shoppingGoodsNum)
    let currentNum = shoppingcartLists[currentIndex].number++;
    if (updataNumTimer) {
      console.log("定时器存在,取消修改请求")
      return;
    }
    //修改购物车商品数量
    updataNumTimer = setTimeout(function () {
      console.log("1s后执行")

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
          num: shoppingGoodsNum
        },
        success: function (res) {
          clearTimeout(updataNumTimer);
          updataNumTimer = null;
          console.log(res)
          //that.getShoppingList(that)
          shoppingcartLists[currentIndex].number = shoppingGoodsNum;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })
          //查询购物车商品数量
          wx.request({
            url: api.queryCommodityNumFromShoppingCart,
            data: {
              openId: openId
            },
            success: function (res) {
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
        fail: function () {
          clearTimeout(updataNumTimer);
          updataNumTimer = null;
          tip.tip_msg(that, "网络异常,请重试")
          shoppingcartLists[currentIndex].number = lastshoppingGoodsNum;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })
        }
      })
    }, 500)

  },
  // 购物车页面数量控制 减少
  shopCarnumReduce: function (e) {
    var that = this;

    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表
    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index
    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id
    let currentNum = shoppingcartLists[currentIndex].number - 1;
    // console.log(currentNum)
    console.log(that.data.shoppingcartLists[currentIndex].number)
    //如果正在++,返回
    if (updataNumTimer) {
      return;
    }
    if (!reduceNumTimer) {
      shoppingGoodsNumReduce = that.data.shoppingcartLists[currentIndex].number;
      lastshoppingGoodsNum = shoppingGoodsNumReduce
      console.log("请求前的商品数量--" + lastshoppingGoodsNum)
    }
    shoppingGoodsNumReduce--;

    console.log(shoppingGoodsNumReduce)
    if (shoppingGoodsNumReduce <= 0) {
      shoppingGoodsNumReduce = 1;
      tip.tip_msg(that, "不能再减了")
      return;
    }
    that.data.shoppingcartLists[currentIndex].number = shoppingGoodsNumReduce;
    that.setData({
      shoppingcartLists: that.data.shoppingcartLists
    })
    if (reduceNumTimer) {
      console.log("定时器存在,取消修改请求")
      return;
    }
    reduceNumTimer = setTimeout(function () {

      console.log(shoppingGoodsNumReduce)
      console.log("1s后执行--")
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
          num: shoppingGoodsNumReduce
        },
        success: function (res) {
          console.log("修改成功")
          clearTimeout(reduceNumTimer);
          reduceNumTimer = null;
          // that.getShoppingList(that)
          shoppingcartLists[currentIndex].number = shoppingGoodsNumReduce;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })

          //查询购物车商品数量
          wx.request({
            url: api.queryCommodityNumFromShoppingCart,
            data: {
              openId: openId
            },
            success: function (res) {
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
        fail: function (res) {
          clearTimeout(updataNumTimer);
          reduceNumTimer = null;
          tip.tip_msg(that, "网络异常,请重试")
          shoppingcartLists[currentIndex].number = lastshoppingGoodsNum;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })
        }
      })
    }, 500)


  },
  //购物车页面数量  直接输入文字改变
  shopCarwritenum: function (e) {
    var that = this;
    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表

    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index

    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id

    let currentNum = e.detail.value;
    if (currentNum <= 0) {
      console.log(e)
      tip.tip_msg(that, "数量不能小于1哦！！");
      console.log(that.data.currentNum)
      currentNum = 1
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
        num: currentNum
      },
      success: function (res) {
        console.log(res)
        that.getShoppingList(that)

        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId
          },
          success: function (res) {
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
  // 购物车商品属性展开
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
  // 购物车商品服务展开
  shopCarServeMore: function (e) {
    if (ServenoneNum != e.target.dataset.id) {
      ServenoneNum = e.target.dataset.id;
    } else {
      ServenoneNum = "";
    }
    this.setData({
      Servenone: ServenoneNum
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
  //商品列表数量--
  goodsCarnumReduce: function () {
    var that = this;
    if (that.data.chooseNum == 1) {
      tip.tip_msg(that, "不能再减了");
      return;
    }
    if (that.data.shopCarnum > 0) {
      that.setData({
        chooseNum: that.data.chooseNum - 1
      })
    }
  },
  //商品数量++
  goodsCarnumAdd: function () {
    var that = this;
    console.log(this.data.chooseNum)
    if (this.data.chooseNum >= 999) {
      tip.tip_msg(that, "单个商品数量添加已达上限")
      return;
    }
    that.setData({
      chooseNum: that.data.chooseNum + 1
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
      chooseNum: parseInt(blurValue),
      shopCarnum: parseInt(blurValue)
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
                openId: openId
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
                    openId: openId
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
        unionId: unionId
      },
      success: function (res) {
        that.getShoppingList(that)

        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId
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
  //搜索
  searchSubmit: function (e) {
    let that = this
    // let searchContent = that.data.search_placeholder
    console.log(e)
    let searchContent = e.detail.value.searchContent

    that.setData({
      search_content: searchContent,
      screenLock: true
    })
    console.log(e.detail.value.searchContent)
    that.getSearchResult(searchContent)
  },
  //输入法搜索
  searchSubmitInput: function (e) {
    let that = this
    let searchContent = e.detail.value
    that.getSearchResult(searchContent)
  },
  //请求搜索结果
  getSearchResult: function (searchContent) {
    let that = this
    //输入空格

    
    //输入为空
    if (searchContent == "") {
      console.log("输入为空")
      // tip.tip_msg(that, "搜索内容不能为空")
      searchContent = that.data.search_placeholder
    } else if (searchContent.replace(/^\s+$/g, "").length == 0) {
      console.log("输入为空格")
      tip.tip_msg(that, "搜索内容不能为空")
      return;
    }
    console.log(searchContent)

    pageIndex = 1;

    wx.request({
      url: api.queryCommodityByCondition,
      method: 'get',
      data: {
        openId: openId,
        //unionId: unionId,
        keywords: searchContent,
        pageIndex: pageIndex,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        pageIndex++
        console.log(res)
        overtime = false;
        // clearTimeout(timer)
        if (res.data.code == "0") {
          var data = res.data.results;
          //点击搜索清空 最低价 最高价 搜索品牌
          lowerPrice = "";
          uperPrice = "";
          brand_result = [];
          let brand_list = that.data.brand_list;
          if (brand_list != undefined){
            brand_list.forEach((item) => {
              item.checked = false
            })
          }
          
          wx.hideLoading()
          that.setData({
            lists: that.data.lists.slice(0, 4)
          })
          console.log(that.data.lists)
          that.setData({
            lists: res.data.data.results,
            // productCategoryId: optionsnum,
            customerStatus: customerStatus,
            // overtime: false
            bottom_show: false,
            searchContent: searchContent,
            search_content: searchContent,
            search_placeholder: searchContent,
            minPrice: "",
            maxPrice: ""
          })
          if (res.data.data.results.length == 0) {
            allPage = 0
            that.setData({
              allSize: 0
            })
          } else {
            allPage = res.data.data.pagination.allPage;
            that.setData({
              allSize: res.data.data.pagination.allSize
            })
          }
          //  wx.pageScrollTo({
          //    scrollTop: 0
          //  })

          //将搜索内容存入最近搜索缓存
          let search_history = wx.getStorageSync('searchHistory');
          if (search_history == "") {
            search_history = [];
          }

          if (search_history.length > 0) {
            var isAdd = search_history.every(function (item) {//判断最新搜索内容和最近搜索内容是否重复
              return (searchContent != item);
            })
            if (isAdd) {//原来没有，直接添加到最前面
              if (search_history.length == 10) {
                search_history.pop(search_history);
              }
            } else {//原来有，将之前的删除再添加到最前面
              for (var i = 0; i < search_history.length; i++) {
                if (searchContent == search_history[i]) {
                  search_history.splice(i, 1);
                }
              }
            }
            search_history.unshift(searchContent);
          } else {//无最近搜索内容时直接添加
            search_history.unshift(searchContent);
          }
          //更新最近搜索
          wx.setStorageSync('searchHistory', search_history);
        } else {
          tip.tip_msg(that, res.data.message)
        }

      }
    })
  },
  //商品下拉刷新
  goods_toLower: function () {
    // let that=this
    // console.log("下拉")
    // if(pageIndex > allPage) {
    //   console.log("已经到底了")
    //   that.setData({
    //     //到底了
    //     bottom_show:true
    //   })
    //   return;
    // }
    // console.log(pageIndex)
    // wx.request({
    //   url: api.queryCommodityByCondition,
    //   method: 'get',
    //   data: {
    //     openId: openId,
    //     //unionId: unionId,
    //     keywords: that.data.searchContent,
    //     pageIndex: pageIndex
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     pageIndex++
    //     console.log(res)
    //     console.log(res.data.data.results)
    //     overtime = false;
    //     // clearTimeout(timer)
    //     if (res.data.code == "0") {
    //       var data = res.data.results;
    //       console.log(data)
    //       console.log(customerStatus)
    //       wx.hideLoading()
    //       that.setData({
    //         lists: that.data.lists.concat(res.data.data.results),
    //         // productCategoryId: optionsnum,
    //         customerStatus: customerStatus,
    //         overtime: false
    //       })
    //       console.log(that.data.lists)
    //     } else {
    //       tip.tip_msg(that, res.data.message)
    //     }

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
    let that = this;
    let brandIds = brand_result.join(",")
    console.log("下拉")
    if (pageIndex > allPage) {
      console.log("已经到底了")
      that.setData({
        //到底了
        bottom_show: true
      })
      return;
    }
    console.log(pageIndex)
    wx.request({
      url: api.queryCommodityByCondition,
      method: 'get',
      data: {
        openId: openId,
        //unionId: unionId,
        keywords: that.data.searchContent,
        pageIndex: pageIndex,
        productBrandIds: brandIds,
        minPrice: lowerPrice,
        maxPrice: uperPrice
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        pageIndex++
        console.log(res)
        console.log(res.data.data.results)
        overtime = false;
        // clearTimeout(timer)
        if (res.data.code == "0") {
          var data = res.data.results;
          console.log(data)
          console.log(customerStatus)
          wx.hideLoading()
          that.setData({
            lists: that.data.lists.concat(res.data.data.results),
            // productCategoryId: optionsnum,
            customerStatus: customerStatus,
            overtime: false
          })
          console.log(that.data.lists)
        } else {
          tip.tip_msg(that, res.data.message)
        }

      }
    })
  },

  //失去焦点时获取用户搜索内容
  getSearchContent: function (e) {
    var that = this;
    that.setData({
      delete_search_show: false
    })
  },
  //输入框聚焦时显示X
  clearSearchContent: function (e){
     search_focus=this.data.search_content;
     this.setData({
       delete_search_show: true
     })
  },
  //点击X删除输入内容
  delete_searchContent: function () {
    console.log("点击删除")
    this.setData({
      search_content: "",
      // search_focus_control:true
    })
  
  },

  search_focus: function(){

  },
  //失去焦点时获取最低价格
  getLowerPrice: function (e) {
    lowerPrice = e.detail.value;
  },
 

  //失去焦点时获取最高价格
  getUperPrice: function (e) {
    uperPrice = e.detail.value;
  },

  // 商品筛选
  screeningShop: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset)
    var search_content = that.data.search_placeholder;
    console.log(search_content)
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    wx.request({
      url: api.queryProductBrandByKeywords,
      method: 'GET',
      data: {
        openId: openId,
        systemVersion: systemVersion,
        Keywords: search_content
      },
      success: function (res) {
        if (that.data.brand_list == undefined ||  that.data.screenLock == true) {
          var brand_list = res.data.data.results;
          console.log(brand_list)

        } else {
          var brand_list = that.data.brand_list;
        }
        let screenValue = that.data.screenValue;
               
          that.setData({
            brand_list: brand_list,
            // screenLock: true,
            mask_show:true
          })
        common.common(currentStatu, that, 300, showThis);
      }
    })
  },
  filterBrandChange: function (res) {
    let that = this
    var value = res.detail.value;
    console.log(value)
    brand_result = [];
    let brand_list = that.data.brand_list;
    brand_list.forEach((item) => {
      item.checked = false
    })
  
    value.forEach((item, index) => {
      console.log(item)
      // brand_list[item].checked = true
      brand_list[item].checked = true
      // if (brand_result.length != 0) {
      //   for (var i = 0; i < brand_result.length; i++) {
      //     if (brand_list[item].id == brand_result[i]) {
      //       brand_result.splice(i, 1);
      //     }
      //   }
      // }
      brand_result.push(brand_list[item].id)
    });
    if(value.length == 0){
      brand_result= [];
    }
    that.setData({
      brand_list: brand_list,
      screenValue: value
    })
    console.log(brand_result)
  },
  //筛选确认按钮
  filterSubmit: function () {
    var that = this;
    var content = that.data.search_placeholder;
    var brandIds = brand_result.join(",");
    pageIndex = 1;
    var minPrice = (lowerPrice == "") ? "" : parseInt(lowerPrice);
    var maxPrice = (uperPrice == "") ? "" : parseInt(uperPrice);
    console.log(minPrice, maxPrice,brandIds);
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: api.queryCommodityByCondition,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openId: openId,
        systemVersion: systemVersion,
        keywords: content,
        pageIndex: pageIndex,
        productBrandIds: brandIds,
        minPrice: minPrice,
        maxPrice: maxPrice
      },
      success: function (res) {
        pageIndex++
        console.log(res)
        if (minPrice != "" || maxPrice != "" || brandIds != "") {
          that.setData({
            screenLock: false
          })
        } else {
          that.setData({
            screenLock: true
          })
        }

        if (res.data.code == "0") {
          that.setData({
            lists: that.data.lists.slice(0, 1)
          })
          that.setData({
            lists: res.data.data.results,
            bottom_show: false,
            minPrice: minPrice,
            maxPrice: maxPrice
          })
          wx.hideLoading()
          if (res.data.data.results.length == 0) {
            allPage = 0
            that.setData({
              allSize: 0
            })
          } else {
            allPage = res.data.data.pagination.allPage;
            that.setData({
              allSize: res.data.data.pagination.allSize
            })
          }
        } else {
          tip.tip_msg(that, res.data.message)
        }

      }
    })

  },
  //筛选重置
  filterReset: function () {
    let that = this;
    let brand_list = that.data.brand_list
    brand_result = [];
    lowerPrice = "";
    uperPrice = "";
    brand_list.forEach((item) => {
      item.checked = false
    })
    that.setData({
      brand_list: brand_list,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})