//当前这个模块：API进行统一管理
import service from "@/api/request";
import requestMock from "@/api/requestMock";
import requestSyl from '@/api/requestCode'

//三级联动接口
///api/product/getBaseCategoryList
//发送请求：axios发送请求返回结果Promise对象
export const reqCategoryList = () => service({url: '/product/getBaseCategoryList', method: 'get'})

//获取banner（Home首页轮播图接口）
export const reqGetBannerList = () => requestMock({url: '/banner', method: 'get'})

//获取floor数据
export const reqFloorList = () => requestMock({url: '/floor', method: 'get'})

//获取搜索模块数据 地址：/api/list 请求方式：post 参数：需要带参数
//当前这个接口（获取搜索模块的数据），给服务器传递一个默认参数【至少是一个空对象】
export const reqGetSearchInfo = (params) => service({url: '/list', method: 'post', data: params})

//获取产品详情信息接口 地址：/api/item/{id} 请求方式：get
export const reqGoodsInfo = (id) => service({url: `/item/${id}`, method: 'get'})

//将产品添加到购物车中（获取更新某一个产品的个数）
// 地址：/api/cart/addToCart/{skuId}/{skuNum}
export const reqAddOrUpdateShopCart = (skuId, skuNum) => service({
  url: `/cart/addToCart/${skuId}/${skuNum}`,
  method: 'post'
})

  //获取购物车列表 地址：/api/cart/cartList
export const reqCartList = () => service({url:'/cart/cartList',method:'get'})

//删除购物车商品 地址：/api/cart/deleteCart/{skuId}
export const delCartPro = (id) => service({url:`/cart/deleteCart/${id}`,method:'DELETE'})

//修改产品状态 /api/cart/checkCart/{skuID}/{isChecked}
export const updateProState = (skuID,isChecked) => service({url:`/cart/checkCart/${skuID}/${isChecked}`,method:'get'})

//发送验证码接口
export const reqCode = (phone) => requestSyl({url:`/edumsm/msm/send/${phone}`,method:'get'})

//注册接口 /educenter/member/register
export const registerUser = (userInfo) => requestSyl({url:`/educenter/member/register`,method:'post',data:userInfo})

//用户登录接口 /educenter/member/login
export const loginUser = (userInfo) => requestSyl({url:`/educenter/member/login`,method:'post',data:userInfo})

//根据token获取用户信息 /educenter/member/getMemberInfo
export const getUserInfo = () => requestSyl({url:`/educenter/member/getMemberInfo`,method:'get'})

//获取用户地址信息 地址：/api/user/userAddress/auth/findUserAddressList
export const reqAddressInfo = () => service({url:'/user/userAddress/auth/findUserAddressList',method:'get'})

//登录的接口:请求体携带参数 phone&&password
export const reqUserLogin = (data)=>service({url:`/user/passport/login`,method:'post',data});

//获取订单交易信息 /api/order/auth/trade
export const getOrderInfo = () => service({url:`/order/auth/trade`,method:'get'})

//提交订单 /api/order/auth/submitOrder?tradeNo={tradeNo}
export const reqSubmitOrder = (tradeNo,data) => service({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,method:'post',data})

//获取订单支付信息  /api/payment/weixin/createNative/{orderId}
export const reqPayInfo = (orderId) => service({url:`/payment/weixin/createNative/${orderId}`,method:'get'})

//获取订单支付状态  /api/payment/weixin/queryPayStatus/{orderId}
export const reqPayStatus = (orderId) => service({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})

//获取个人中心的数据 /api/order/auth/{page}/{limit}
export const reqMyOrderList = (page,limit) => service({url:`/order/auth/${page}/${limit}`,method:'get'})
