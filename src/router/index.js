//配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from "@/router/routes";
import cookie from 'js-cookie'
import { Message } from 'element-ui'
//使用插件
Vue.use(VueRouter)
//先把VueRouter原型对象的push，先保存一份
let originPush = VueRouter.prototype.push

//重写push|replace
//第一个参数：告诉原来的push方法，你往哪里跳转（传递哪些参数）
VueRouter.prototype.push = function (location, resolve, reject) {
	if (resolve && reject) {
		//call和apply区别
		//相同点，都可以调用函数一次，都可以篡改函数的上下文一次，把originPush的函数的window指向改为VueRouter指向（this.$router.push）
		//不同点，call与apply传递参数：call传递参数用 逗号 隔开，apply方法执行，传递数组
		originPush.call(this, location, resolve, reject)
	} else {
		originPush.call(this, location, () => { }, () => { })
	}
}

//配置路由
const createRouter =  new VueRouter({
	routes,
  //滚动行为
  scrollBehavior (to, from, savedPosition) {
	  //返回的这个y=0，代表的滚动条在最上方
    return {y: 0}
  }
})

const router = createRouter

//全局前置路由守卫（在路由跳转之间判断）
router.beforeEach((to,from,next) => {
  //next(path) 放行到指定路由 next()放行
  let userInfoCookie = cookie.get('userInfo')
  let userInfoLocal =  localStorage.getItem('userInfo')
  //debugger
  if(userInfoLocal || (userInfoCookie !== '0' && userInfoCookie)){
    if(to.path === '/login'){
      Message({
        message: '您已经登录过了，无需继续登录',
        type: 'success',
      })

      next('/home')
    }
    next()
  }else{
    if(to.path === '/trade' || to.path === '/pay' || to.path === '/paysuccess' || to.path.indexOf('/center') !== -1){
      Message({
        message: '请先进行登录',
        type: 'error',
      })
      //把未登录的时候想去的地址，存储于地址栏中
      next('/login?redirect='+to.path)
    }
    next()
  }
})

//全局后置路由守卫（设置标题）
router.afterEach((to) => {
  document.title = to.meta.title
})

export default router
