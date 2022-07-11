//home模块小仓库‘
import {reqGetSearchInfo} from '@/api'
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  //获取search模块数据
  getSearchList(context, params = {}) {
    //当前这个reqGetSearchInfo这个函数在调用获取服务器数据的时候，至少传一个参数{空对象}
    //params形参：是用户派发action的时候，第二个参数传递过来的，至少是一个空对象
    reqGetSearchInfo(params).then(req => {
      if (req.code === 200) {
        context.commit("GETSEARCHLIST", req.data)
      }
    })
  }
};
//mutations:修改state的唯一手段
const mutations = {
  GETSEARCHLIST(state,searchList){
    state.searchList = searchList
  }
}
//state:仓库存储数据的地方
const state = {
  searchList:{}
};
//getters:理解为计算属性，属于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
  //商品属性列表
  attrsList(state){
    return state.searchList.attrsList || []
  },

  //商品列表
  goodsList(){
    return state.searchList.goodsList || []
  },

  //品牌列表
  trademarkList(){
    return state.searchList.trademarkList || []
  },
};
//对外暴露Store类的一个默认实例
export default ({
  state,
  actions,
  mutations,
  getters,
})
