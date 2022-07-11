import {reqCategoryList, reqGetBannerList, reqFloorList} from '@/api'
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  //通过api里面的接口函数回调，向服务器发送请求
  categoryList(context) {
    reqCategoryList().then(req => {
      if (req.code === 200) {
        context.commit('CATEGORYLIST', req.data)
      }
    })
  },
  //获取首页轮播图的数据
  getBannerList(context){
    reqGetBannerList().then(req => {
      if (req.code === 200) {
        context.commit('GETBANNERLIST', req.data)
      }
    })
  },
  //获取floor数据
  getFloorList(context){
    reqFloorList().then(req => {
      if(req.code === 200){
        context.commit('GETFLOORLIST',req.data)
      }
    })
  }
};
//mutations:修改state的唯一手段
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList
  },

  GETBANNERLIST(state,bannerList){
    state.bannerList = bannerList
  },

  GETFLOORLIST(state,floorList){
    state.floorList = floorList
  }
}
//state:仓库存储数据的地方
const state = {
  //state中数据默认初始值不能瞎写，服务器返回对象，服务器返回数组。【根据接口返回值初始化】
  categoryList: [],
  //轮播图的数据
  bannerList:[],
  //floor轮播图的数据
  floorList:[],
};
//getters:理解为计算属性，属于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {};
//对外暴露Store类的一个默认实例
export default ({
  state,
  actions,
  mutations,
  getters,
})
