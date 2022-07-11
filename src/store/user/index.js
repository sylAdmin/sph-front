import { reqCode,registerUser,loginUser,getUserInfo,reqUserLogin} from "@/api";
import cookie from "js-cookie";
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  //获取验证码
  async getCode(context,phone) {
    let res = await reqCode(phone)
    return res
  },
  //用户注册
  async userRegister(context,userInfo){
    let res = await registerUser(userInfo)
    return res
  },
  //用户登录
  async userLogin(context,userInfo){
    let res = await loginUser(userInfo)
    context.commit('USERLOGIN',res.data.token)
    return res
  },
  //根据token获取用户信息
  async getUserLoginInfo(context,isAutoLogin){
    let res = await getUserInfo()
    if(res.code === 20000 && isAutoLogin !== undefined){
      if(!isAutoLogin){
        let userInfo = JSON.stringify(res.data.userInfo)
        cookie.set('userInfo',userInfo,{domain:'.sylking.cloud'})
      }else{
        let userInfo = JSON.stringify(res.data.userInfo)
        localStorage.setItem('userInfo',userInfo)
      }
    }
  },
  //获取老师的token
  async getToken(context){
    let res = await reqUserLogin({phone:'13700000000',password:"111111"})
    if(res.code === 200){
      cookie.set('token',res.data.token)
      return res
    }
  }
};
//mutations:修改state的唯一手段
const mutations = {
  USERLOGIN(state,token){
    state.token = token
  },
}
//state:仓库存储数据的地方
const state = {
  token:'',
};
//getters:理解为计算属性，属于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
};
//对外暴露Store类的一个默认实例
export default ({
  state,
  actions,
  mutations,
  getters,
})
