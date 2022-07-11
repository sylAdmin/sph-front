<template>
  <!-- 首页 -->
  <div>
    <!-- 三级联动全局组件：三级联动已经注册为全局组件，因此不需要在引入 -->
    <TypeNav/> <!-- 商品分类导航（三级联动全局组件） -->
    <ListContainer/> <!-- 列表 -->
    <Recommend/> <!-- 今日推辞 -->
    <Rank/> <!-- 商品排行 -->
    <Like/> <!-- 喜欢 -->
    <!-- Floor这个组件：自己在组件内部是没有发送请求的，数据是父组件给的 -->
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor"/> <!-- 楼层 -->
    <Brand/> <!-- 商标 -->
  </div>
</template>

<script>
  import ListContainer from '@/views/Home/ListContainer'
  import Recommend from '@/views/Home/Recommend'
  import Rank from '@/views/Home/Rank'
  import Like from '@/views/Home/Like'
  import Floor from '@/views/Home/Floor'
  import Brand from '@/views/Home/Brand'
  import {mapState} from 'vuex'

  export default {
    components: {
      ListContainer,
      Recommend,
      Rank,
      Like,
      Floor,
      Brand,
    },

    mounted() {
      //派发action，获取floor组件的数据
      this.$store.dispatch("getFloorList")
      this.$store.dispatch('getUserLoginInfo')
    },

    computed:{
      ...mapState({
        floorList(state){
          return state.home.floorList
        }
      })
    }
  }
</script>

<style>

</style>
