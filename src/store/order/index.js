import {reqAddressInfo,getOrderInfo} from '@/api'
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  //获取订单地址
  async getAddressInfo(context){
    let res = await reqAddressInfo()
    if(res.code === 200){
      context.commit('GETADDRESSINFO',res.data)
    }
  },
  //获取订单信息
  async getOrder(context){
    let res = await getOrderInfo()
    if(res.code === 200){
      context.commit('GETORDER',res.data)
    }
  }
};
//mutations:修改state的唯一手段
const mutations = {
  GETADDRESSINFO(state,addressList){
    state.addressList = addressList
  },
  GETORDER(state,orderProList){
    state.orderProList =  orderProList
  }
}
//state:仓库存储数据的地方
const state = {
  addressList:[],
  orderProList:{}
};
//getters:理解为计算属性，属于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
  addressList(state){
    return state.addressList || []
  },
  orderProList(state){
    return state.orderProList
  }
};
//对外暴露Store类的一个默认实例
export default ({
  state,
  actions,
  mutations,
  getters,
})
