<template>
  <div class="spec-preview" v-show="skuInfo">
    <img :src="imgUrl" />
    <div class="event" @mousemove="handler" @mouseleave="startInteval"></div>
    <div class="big">
      <img :src="imgUrl" ref="big"/>
    </div>
    <!-- 遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props:['skuInfo'],
    data(){
      return {
        imgUrl:''
      }
    },

    methods: {
      //获取最新的图片
      getImgUrl(){
        let skuImageList = this.skuInfo.skuImageList
        if(skuImageList.length !== 0) {
          for (let i = 0; i < skuImageList.length; i++) {
            if (!skuImageList[i].isDefault) {
              this.imgUrl = skuImageList[i].imgUrl
              return
            } else if (skuImageList[i].isDefault === '1') {
              this.imgUrl = skuImageList[i].imgUrl
            }
          }
        }else{
          this.imgUrl = this.skuInfo.skuDefaultImg
        }
      },
      //放大镜
      handler(event){
        this.$bus.$emit('cleanTimer')
        let mask = this.$refs.mask
        let big = this.$refs.big
        let left = event.offsetX - mask.offsetWidth/2
        let top = event.offsetY - mask.offsetHeight/2
        //约束范围
        if(left <= 0)left = 0
        if(left >= mask.offsetWidth)left = mask.offsetWidth
        if(top<=0)top=0
        if(top>=mask.offsetHeight)top=mask.offsetHeight
        //修改元素的left|top属性值
        mask.style.left = left + 'px'
        mask.style.top = top + 'px'
        big.style.left = - 2 * left + 'px'
        big.style.top = - 2 * top + 'px'
      },
      //鼠标离开开启定时器
      startInteval(){
        this.$bus.$emit('startInteval')
      }
    },

    watch: {
      skuInfo:{
        handler(newValue,oldValue){
          this.getImgUrl()
        }
      }
    },

    mounted() {
      this.$bus.$on('getImgUrl',() => {
        this.getImgUrl()
      })
    },

    beforeDestroy() {
      this.$bus.$emit('cleanTimer')
    }
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>
