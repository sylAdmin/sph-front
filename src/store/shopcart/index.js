import {reqCartList,delCartPro,updateProState} from '@/api'
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
//state:仓库存储数据的地方
const state = {
  //购物车数据
  cartList:[]
};
const actions = {
  //获取购物车列表数据
  async getCartList(context){
    let res = await reqCartList()
    if(res.code === 200){
      context.commit('GETCARTLIST',res.data)
    }
  },
  //删除购物车商品
  async delCart(context,id){
    let res = await delCartPro(id)
    if(res.code === 200){
      return res
    }else {
      return Promise.reject(new Error('error'))
    }
  },
  //更新产品状态
  async updateCart(context,params){
    let result = updateProState(params.id,params.isChecked)
    if(result.code === 200){
      return result
    }else{
      return Promise.reject(new Error('error'))
    }
  },
  //删除选中的购物车商品
  delAllCheckedCart({dispatch,getters}){
    let PromiseAll = []
    getters.cartList[0].cartInfoList.forEach(item => {
      let promise = item.isChecked === 1 ? dispatch('delCart',item.skuId) : ""
      PromiseAll.push(promise)
    })
    return Promise.all(PromiseAll)
  }
};
//mutations:修改state的唯一手段
const mutations = {
  GETCARTLIST(state,cartList){
    state.cartList = cartList
  }
}
//getters:理解为计算属性，属于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
  cartList(state){
    return state.cartList || []
  }
};
//对外暴露Store类的一个默认实例
export default ({
  state,
  actions,
  mutations,
  getters,
})
