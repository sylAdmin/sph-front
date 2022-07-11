<template>
  <div class="swiper-container" v-if="skuImgList" ref="floor2Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(skuImg,index) in skuImgList" :key="skuImg.id">
        <img :src="skuImg.imgUrl" :class="{active:skuImg.isDefault === '1' || skuImgList.length === 1}"
             @mouseenter="changeActive(skuImg,skuImgList)">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
  import Swiper from 'swiper'
  export default {
    name: "ImageList",
    props:['skuImgList'],
    data(){
      return {
        timer:Math.random()
      }
    },
    watch: {
      skuImgList:{
        handler(newValue,oldValue) {
          this.$nextTick(() => {
            let mySwiper = new Swiper(
                this.$refs.floor2Swiper,
                {
                  // 如果需要前进后退按钮
                  navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },
                  //显示几个图片设置
                  slidesPerView: 3,
                  //每一次切换图片的个数
                  slidesPerGroup:1
                }
            )
          })
          this.startInteval()
        }
      },
    },
    methods: {
      changeActive(skuImg,skuImgList){
        //用户发生了点击行为销毁定时器
        clearInterval(this.timer)
        skuImgList.forEach(item => {
          item.isDefault = '0'
        })
        skuImg.isDefault = '1'
        this.$bus.$emit('getImgUrl')
      },
      //开启定时器，每3秒换一个轮播图
      startInteval(){
        if(this.skuImgList === undefined || !this.skuImgList[0].isDefault) {
          return;
        }else{
          this.timer = setInterval(() => {
            var index = 0
            for (let i = 0; i < this.skuImgList.length; i++) {
              if (this.skuImgList[i].isDefault === '1') {
                index = i
              }
            }
            this.skuImgList[index].isDefault = '0'
            if(index + 1 === this.skuImgList.length){
              index = -1
            }
            this.skuImgList[index + 1].isDefault = '1'
            this.$bus.$emit('getImgUrl') //通知Zoom组件更换图片
          }, 4000)
        }
      }
    },
    beforeDestroy() {
      //在组件销毁前销毁定时器
      clearInterval(this.timer)
    },
    mounted() {
      //关闭定时器
      this.$bus.$on('cleanTimer', () => {
        clearInterval(this.timer)
      })
      //开启定时器
      this.$bus.$on('startInteval', () => {
        this.startInteval()
      })
    }
  }
</script>

<style lang="less" scoped>
  .swiper-container {
    height: 56px;
    width: 412px;
    box-sizing: border-box;
    padding: 0 12px;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;

        &.active {
          border: 2px solid #f60;
          padding: 1px;
        }

        &:hover {
          border: 2px solid #f60;
          padding: 1px;
        }
      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: rgb(235, 235, 235);
      border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;

      &::after {
        font-size: 12px;
      }
    }
  }
</style>
