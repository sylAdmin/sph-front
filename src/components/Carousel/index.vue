<template>
  <!-- 轮播图的地方 -->
  <div class="swiper-container" ref="floor1Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(carouse,index) in list" :key="carouse.id">
        <img :src="carouse.imgUrl"/>
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
  import Swiper from 'swiper'

  export default {
    name: 'Carousel',
    props: ['list'],
    watch: {
      //监听bannerList数据的变化：因为这条数据发生过变化----由空数组变为数据里有四个元素
      list: {
        //为什么watch监听不到list：因为这个数据从来没有发生变化（数据是父亲给的，给的时候就已经有值了）
        immediate: true, //立即监听：不管数据有没有发生变化，立即上来监听一次
        handler(newValue, oldValue) {
          //只能监听到数据已经有了，但是v-for动态渲染结构我们还是没有办法确定的，因此还是要用到nextTick
          this.$nextTick(() => {
            let mySwiper = new Swiper(
                this.$refs.floor1Swiper,
                {
                  autoplay: { //自动更换
                    disableOnInteraction: false,  // 用户操作swiper之后，是否禁止autoplay
                    delay: 3000, // 自动切换的时间间隔（单位ms）
                  },
                  loop: true, // 循环模式选项
                  // 如果需要分页器
                  pagination: {
                    el: '.swiper-pagination',
                    clickable: true, //点击分页点更换轮播图
                  },

                  // 如果需要前进后退按钮
                  navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },

                  // 如果需要滚动条
                  scrollbar: {
                    el: '.swiper-scrollbar',
                  },
                }
            )
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
