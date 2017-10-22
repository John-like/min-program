/**
 * 小程序api接口
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la
const host = require('../config.js').host;

var api = {
  host,
  //登录
  //index: host + "index.php?app=home&p=1&goods_num=5",

  //1.17	销售端登录接口
  login: host + "login",

  //1.1 获取客户信息
  getCustomer: host +"findUniqueCustomer",

 //1.2 获取客户收货地址列表（分页）
  getAddressItem: host +"getItems",

  //1.3 修改客户收货地址为默认地址
  serAddressDefault: host + "set_CustomerAddress_Default",

  //1.4 根据客户收货地址ID获取收货地址详情
  getAddressDetail: host + "detail",

  //1.5修改客户收货地址
  updateAddress: host +"updateCustomerAddress",

  //1.6 新增客户收货地址
  addAddress: host +"addCustomerAddress",

  //1.7 删除客户收货地址（根据收货地址ID）
  removeAddress: host +"removeCustomerAddressById",

  //1.8	获取地区省市区（不分页，可用于缓存）
  getAreaAll: host +"queryBasisRegion",

  //1.9	获取商品套餐包列表（不分页）
  getCommodityPackageList: host +"queryCommodityPackageList",

  //1.10	根据套餐包ID获取套餐包详情信息
  getCommodityPackageById: host + "queryCommodityPackageById",

  //1.11	根据套餐包ID获取该套餐包空间列表（不分页）
  getPackageSpaceListByPackageId: host + "queryPackageSpaceListByPackageId",

  //1.12	根据套餐包ID及套餐包空间ID获取商品列表（分页）
  getCommodityByPackageIdAndPackageSpaceId: host + "queryCommodityByPackageIdAndPackageSpaceId",

  //1.13	获取品类列表（不分页）
  getAllCategory: host + "queryAllCategory",

  //1.14	根据品类ID获取商品列表（分页）
  getCommodityByCategoryId: host + "queryCommodityByProductCategoryId",

  //1.15	根据商品ID获取商品详情
  getInfoById: host + "commodityInfoById",

  //1.16	根据商品ID获取颜色、型号、服务
  commotifyPropertyById: host + "commotifyPropertyById",

  //1.18	查询所有组合包商品（分页）
  queryCombinationCommodity: host + "queryCombinationCommodity",

  //1.19	查询购物车商品数量（用于刷新购物车图标上数字）
  queryCommodityNumFromShoppingCart: host + "queryCommodityNumFromShoppingCart",

  //1.20	查询购物车商品列表（分页）
  queryCommodityListFromShoppingCart: host + "queryCommodityListFromShoppingCart",

  //1.21	新增商品到购物车
  addCommodityToShoppingCart: host + "addCommodityToShoppingCart",

  //1.22	从购物车中删除商品
  removeCommodityFromShoppingCart: host + "removeCommodityFromShoppingCart",

  //1.23	从购物车中修改商品数量
  updateNumFromShoppingCart: host + "updateNumFromShoppingCart",

  //1.24	查询订单列表（分页）
  queryCommodityListFromOrder: host + "queryCommodityListFromOrder",

  //1.25	获取订单详细信息
  queryCommodityInfoByOrderCommodityId: host + "queryCommodityInfoByOrderCommodityId",

  //1.26	取消订单
  cancelOrder: host + "cancelOrder",

  //1.27	从购物车生成订单（生成订单后需要删除购物车里已转的商品）
  placeOrderFromShoppingCart: host + "placeOrderFromShoppingCart",

  //1.28	1.28	提交审核资料
  submitCustomerInfo: host + "submitCustomerInfo",

  //1.29	获取用户状态
  getCustomerStatus: host + "getCustomerStatus",

  //1.30	清空购物车
  clearShoppingCart: host + "clearShoppingCart",

  //1.31 发送手机验证码
  sendValidationSms: host + "sendValidationSms",

  //1.32 手机号注册
  toMobileBidding: host + "toMobileBidding",

  //1.33 根据关键字模糊查询商品列表（分页）
  queryCommodityByCondition: host + "queryCommodityByCondition"
};

module.exports = api
