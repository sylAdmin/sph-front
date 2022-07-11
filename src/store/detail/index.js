import { reqGoodsInfo, reqAddOrUpdateShopCart} from "@/api";
//封装游客身份模块uuid-->生成一个随机字符串（不能在变了）
import {getUUID} from '@/utils/uuid_token'
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  //获取产品详情信息
  getGoodInfo(context,id){
    reqGoodsInfo(id).then(res => {
      if(res.code === 200){
        context.commit('GETGOODINFO',res.data)
      }
    })
  },

  async getShopCart(context,{skuId,skuNum,skuInfo}){
    let res = await reqAddOrUpdateShopCart(skuId,skuNum)
    if(res.code === 200){
      return {skuId,skuNum,skuInfo}
    }else{
      return Promise.reject(new Error('error'))
    }
  },
};
//mutations:修改state的唯一手段
const mutations = {
  GETGOODINFO(state,goodInfo){
    state.goodInfo = goodInfo
  },
}
//state:仓库存储数据的地方
const state = {
  goodInfo: {},
  //游客临时身份
  uuid_token:getUUID()
};
//getters:理解为计算属性，属于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
  //导航路径数据
  categoryView(state){
    return state.goodInfo.categoryView || {}
  },
  //主要内容数据
  skuInfo(state){
    return state.goodInfo.skuInfo || {}
  },
  //售卖属性
  spuSaleAttrList(){
    return state.goodInfo.spuSaleAttrList || []
  }
};
//对外暴露Store类的一个默认实例
export default ({
  state,
  actions,
  mutations,
  getters,
})
