import Vue from 'vue'
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
//三级联动组件---全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
//注册全局组件
Vue.component(TypeNav.name,TypeNav) //轮播图
Vue.component(Carousel.name,Carousel) //商品分类三级列表
Vue.component(Pagination.name,Pagination) //分页
//import {Message,MessageBox} from 'element-ui';
//统一引入全部请求函数
import * as API from '@/api'
//引入路由
import router from '@/router'
//引入仓库
import store from './store'
//引入MockServe.js----mock数据
import '@/mock/mockServe'
//引入swiper样式
import 'swiper/css/swiper.css'
Vue.config.productionTip = false
// Vue.prototype.$message = Message;
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
import jz from '@/assets/2.gif'
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload,{
  //懒加载默认图片
  loading: jz
})

new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this //安装全局事件总线，$bus就是当前应用的vm
    Vue.prototype.$API = API
  },
  //注册路由
  router,
  //注册仓库(Vuex)
  store
}).$mount('#app')
