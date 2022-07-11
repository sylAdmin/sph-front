<template>
  <div>
    <Header/>
    <div class='upbutton' @click="backTop" alt="回到顶部">↑</div>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <Footer v-show="$route.meta.show"/>
  </div>
</template>

<script>
  import Header from './components/Header'
  import Footer from './components/Footer'

  export default {
    components: {
      Header,
      Footer
    },
    mounted() {
      //通知Vuex发送请求，获取数据，存储于仓库中
      this.$store.dispatch("categoryList")
      window.addEventListener('scroll',this.scrollToTop,true)
    },
    beforeDestroy() {
      window.removeEventListener('scroll',this.scrollToTop)
    },
    methods:{
      //加计时器，使得返回顶部时有fade 的效果
      backTop(){
        const that = this;
        let timer= setInterval(()=>{
          let upSpeed = Math.floor(-that.scrollTop/5);
          document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + upSpeed;
          if(that.scrollTop === 0){
            clearInterval(timer);
          }
        },16)
      },
      scrollToTop(){
        //alert('进入');，添加次语句可用于测试此时的浏览器窗口距离顶部是否》60
        //计算距离顶部的高度（高度大于60，显示返回按钮，否则隐藏）
        const that=this;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        that.scrollTop = scrollTop;
        if(that.scrollTop > 60){
          that.btnFlag=true;
        }else{
          that.btnFlag=false;
        }
      }
    }
  }
</script>

<style scoped>
  .upbutton {
    /*  设置图片相对于浏览器窗口固定*/
    position: fixed;
    /* 设置图片相对于浏览器的位置
    距离右边180px,底部20px,宽度50px
    */
    cursor:pointer;
    right :60px;
    bottom:30px;
  }
</style>
