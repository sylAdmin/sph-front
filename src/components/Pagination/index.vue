<template>
  <div class="pagination">
    <button :disabled='pageNo === 1'
            @click="$bus.$emit('getPageNo',pageNo - 1)"
            :class="{activeHover:pageNo !== 1}">上一页</button>
    <button v-if="startNumAndEndNum.start > 1"
            :class="{active:pageNo === 1,activeHover:pageNo === 1}"
            @click="$bus.$emit('getPageNo',1)"
            >1</button>
    <span v-if="startNumAndEndNum.start > 2" class="activeHover">...</span>

    <button v-for="(page,index) in startNumAndEndNum.end" v-if="startNumAndEndNum.start <= page"
            @click ="getPageNo(pageNo,page)"
            :class="{active:pageNo === page}" class="activeHover">{{page}}</button>

    <span v-if="startNumAndEndNum.end < totalPage - 1">...</span>
    <button v-if="startNumAndEndNum.end < totalPage"
            class="activeHover"
            @click="$bus.$emit('getPageNo',totalPage)"
            :class="{active:pageNo === totalPage}">{{totalPage}}</button>
    <button :class="{activeHover:pageNo !== totalPage}" :disabled="pageNo === totalPage" @click="$bus.$emit('getPageNo',pageNo + 1)">下一页</button>
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props: ['pageNo', 'pageSize', 'total', 'continues'],
    computed: {
      //总共多少页
      totalPage() {
        return Math.ceil(this.total / this.pageSize)
      },
      //计算出连续页码的起始数字与结束数字[连续页码的数字至少是5]
      startNumAndEndNum() {
        //结构解析，这些变量不用写this了
        const {pageNo, pageSize, total, continues, totalPage} = this
        //先定义两个变量存储起始数字与结束数字
        let start = 0, end = 0
        //连续页码数字是5【就是至少5页】，如果出现不正常现象【就是不够5页】
        //不正常现象【总页数没有连续页码多】
        if (continues > totalPage) {
          start = 1
          end = totalPage
        } else {
          //正常现象【连续页码5，但是你的总页数一定是大于5的】
          start = pageNo - Math.floor(continues / 2)
          end = pageNo + Math.floor(continues / 2)
          //把出现不正常的现象【start数字出现0|负数]纠正
          if (start < 1) {
            start = 1
            end = continues
          }
          //把出现不正常的现象【end数字大于总页码】纠正
          if (end > totalPage) {
            end = totalPage
            start = end - continues + 1
          }
        }
        return {start, end}
      }
    },
    methods:{
      getPageNo(pageNo,page){
        if(pageNo === page){
          return
        }
        this.$bus.$emit('getPageNo',page)
      }
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    text-align: center;

    .activeHover:hover {
      background-color: red;
      color: #fff;
    }

    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: #606266;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: red;
        color: #fff;
      }
    }
  }
</style>
