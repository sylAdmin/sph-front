
let router = [
  //重定向，在项目跑起来的时候，访问 /,立马重定向到首页
  {
    path: '*',
    redirect: '/home',
  },
  {
    path: '/header',
    component: ()=>import("@/components/Header/index"),
    meta: {show: true}
  },
  {
    path: '/home',
    component:()=>import("@/views/Home/index"),
    meta: {show: true, title: "商品汇欢迎您！"}
  },
  {
    path: '/login',
    component: ()=>import("@/views/Login/index"),
    meta: {show: false, title: '用户登录'}
  },
  {
    path: '/register',
    component: ()=>import("@/views/Register/index"),
    meta: {show: false, title: "用户注册"}
  },//()=>import()
  //有params参数走第一个search路由
  {
    name: 'search',
    path: '/search/:keyword',
    component: ()=>import("@/views/Search/index"),
    meta: {show: true, title: '商品列表'}
  },
  //没有params参数走第二个search路由
  {
    name: 'search2',
    path: '/search',
    component: ()=>import("@/views/Search/index"),
    meta: {show: true, title: '商品列表'}
  },
  {
    name: 'detail',
    path: '/detail/:id',
    component: ()=>import("@/views/Detail/index"),
    meta: {show: true, title: '商品详情'}
  },
  {
    name: 'addCartSuccess',
    path: '/addCartSuccess',
    component: ()=>import("@/views/AddCartSuccess/index"),
    meta: {show: true, title: '加入购物车成功'}
  },
  {
    name: 'shopCart',
    path: '/shopCart',
    component: ()=>import("@/views/ShopCart/index"),
    meta: {show: true, title: '我的购物车'}
  },
  {
    name: 'trade',
    path: '/trade',
    component: ()=>import("@/views/Trade/index"),
    meta: {show: true, title: '订单结算'},
    //路由独享守卫
    beforeEnter:(to,from,next) => {
      if(from.path === '/shopCart'){
        //必须重购物车页面来
        next()
      }else{
        //其他组件停留在当前
        next(false)
      }
    }
  },
  {
    name: 'pay',
    path: '/pay',
    component: ()=>import("@/views/Pay/index"),
    meta: {show: true, title: '支付'},
    //路由独享守卫
    beforeEnter:(to,from,next) => {
      if(from.path === '/trade'){
        //必须重购物车页面来
        next()
      }else{
        //其他组件停留在当前
        next(false)
      }
    }
  },
  {
    name: 'paySuccess',
    path: '/paySuccess',
    component: ()=>import("@/views/PaySuccess/index"),
    meta: {show: true, title: '支付成功'},
  },
  {
    name:'center',
    path: '/center',
    component: ()=>import("@/views/Center/index"),
    meta: {show: true, title: '个人订单'},
    redirect: '/center/myorder',
    children: [
      {
        path: 'myorder',
        component: ()=>import("@/views/Center/MyOrder/index"),
        meta: {show: true, title: '我的订单'},
      },
      {
        path: 'grouporder',
        component: ()=>import("@/views/Center/GroupOrder/index"),
        meta: {show: true, title: '团购订单'},
      },
    ]
  },
]

export default router
