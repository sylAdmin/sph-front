<template>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav/>
    <div class="main">
      <div class="py-container">
        <!--bread:面包屑，带有x的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{searchParams.categoryName}}<i
                    @click="removeCategoryName">x</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword">x</i></li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(":")[1]}}<i
                    @click="removeTradeMark">x</i></li>
            <!-- 平台的售卖属性 -->
            <li class="with-x" v-for="(attrValue,index) in searchParams.props">{{attrValue.split(":")[1]}}<i
                    @click="removeProps(index)">x</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector/>

        <!--details-->
        <div class="details clearfix">
          <!-- 排序的结构 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active:isOne}" @click.prevent="changeOrder(1,searchParams.order.split(':')[1])">
                  <a href="#">综合<span v-show="isUpOne">↑</span>
                    <span v-show="isDownOne">↓</span>
                  </a>
                </li>
                <li :class="{active:isTwo}" @click.prevent="changeOrder(2,searchParams.order.split(':')[1])">
                  <a href="#">价格<span v-show="isUpPrice">↑</span>
                    <span v-show="isDownPrice">↓</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
              <ul class="yui3-g">
                <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                  <div class="list-wrap">
                    <div class="p-img">
                      <router-link :to="`/detail/${good.id}`" target="_blank">
                        <img v-lazy="good.defaultImg"/>
                      </router-link>
                    </div>
                    <div class="price">
                      <strong>
                        <em>¥</em>
                        <i>{{good.price}}</i>
                      </strong>
                    </div>
                    <div class="attr">
                      <router-link target="_blank" :to="`/detail/${good.id}`"
                                   :title="'促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】'"
                                   v-html="good.title"></router-link>
                    </div>
                    <div class="commit">
                      <i class="command">已有<span>2000</span>人评价</i>
                    </div>
                    <div class="operate">
                      <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                      <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          <!-- 分页器 -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchSelector from './SearchSelector/SearchSelector'
  import {mapGetters, mapState} from "vuex";

  export default {
    name: 'Search',
    components: {
      SearchSelector
    },
    data() {
      return {
        searchParams: {
          "category1Id": "", //1级分类id
          "category2Id": "", //2级分类id
          "category3Id": "", //3级分类id
          "categoryName": "", //分类名称
          "keyword": "", //搜索关键字
          "order": "1:desc", //排序方式  1:综合,2:价格   asc:升序,desc:降序   示例: "1:desc"
          "pageNo": 1, //当前页
          "pageSize": 10, //每页数量
          "props": [], //商品属性的数组: ["属性ID:属性值:属性名"]   示例: ["2:6.0～6.24英寸:屏幕尺寸"]
          "trademark": "" //品牌: "ID:品牌名称"        示例: "1:苹果"
        },
      }
    },
    //当组件挂载完毕之前执行一次【先于mounted之前】
    beforeMount() {
      //Object.assign:ES6新增语法，合并对象
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
    },
    mounted() {
      this.getData()

      //接收SearchSelector子组件传递过来的数据（子给父传递数据，点击的品牌）
      this.$bus.$on('trademarkData', (trademark) => {
        this.searchParams.trademark = trademark.tmId + ":" + trademark.tmName
        this.getData()
      })

      //收集平台属性{attr -> 售卖属性对象（例：运行内存） attrValue -> 用户点击的售卖属性值（例：128G）
      this.$bus.$on('attrInfo', (attr, attrValue) => {
        let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
        //数组去重(判断数组中有没有重复数据，没有在添加)
        if (this.searchParams.props.indexOf(props) === -1) {
          this.searchParams.props.push(props)
        }
        this.getData()
      })

      //接收Pagination子组件传递过来的数据（当前页）
      this.$bus.$on('getPageNo', (getPageNo) => {
        this.searchParams.pageNo = getPageNo
        this.getData()
        this.$nextTick(function() {
          window.scrollTo({ "behavior": "smooth", "top": 500 })
        })
      })
    },
    computed: {
      //mapGetters里面的写法：传递的数组，因为getters计算没有划分【home,search】
      ...mapGetters(['goodsList']),
      //综合上箭头
      isUpOne() {
        return this.searchParams.order.indexOf("1") !== -1 && this.searchParams.order.indexOf("asc") !== -1
      },
      //综合下箭头
      isDownOne() {
        return this.searchParams.order.indexOf("1") !== -1 && this.searchParams.order.indexOf("desc") !== -1
      },
      //价格上箭头
      isUpPrice() {
        return this.searchParams.order.indexOf("2") !== -1 && this.searchParams.order.indexOf("asc") !== -1
      },
      //价格下箭头
      isDownPrice() {
        return this.searchParams.order.indexOf("2") !== -1 && this.searchParams.order.indexOf("desc") !== -1
      },
      isOne() {
        return this.searchParams.order.indexOf("1") !== -1
      },
      isTwo() {
        return this.searchParams.order.indexOf("2") !== -1
      },
      ...mapState({
        total(state) {
          return state.search.searchList.total;
        }
      })
    },
    methods: {
      //向服务器发送请求获取search模块数据（根据参数不同返回不同数据进行展示）
      getData() {
        this.$store.dispatch('getSearchList', this.searchParams)
      },
      //删除分类的名字
      removeCategoryName() {
        debugger
        //设置为undefined属性的值，该属性不会带给服务器了
        //带给服务器参数可有可无：如果属性值为空的字符串还是会把相应的字段带给服务器
        this.searchParams.categoryName = undefined
        this.searchParams.category1Id = undefined
        this.searchParams.category2Id = undefined
        this.searchParams.category3Id = undefined
        //地址栏需要修改：进行路由跳转
        //严谨：本意是删除query，如果路径当中出现params不应该删除，路由跳转的时候应该带着
        this.getData()
        if (JSON.stringify(this.$route.params) === "{}") {
          this.$router.push({name: 'search2'})
        } else {
          this.$router.push({name: 'search'})
        }
      },
      //删除关键字
      removeKeyword() {
        //设置为undefined属性的值不会带给服务器了
        this.searchParams.keyword = undefined
        this.$route.params.keyword = undefined
        this.$bus.$emit('clear')
        this.getData()
        this.$router.push({name: 'search2', query: this.$route.query})
      },
      //删除品牌信息
      removeTradeMark() {
        this.searchParams.trademark = undefined
        this.getData()
      },
      //删除售卖属性
      removeProps(index) {
        this.searchParams.props.splice(index, 1)
        this.getData()
      },
      //排序的操作
      changeOrder(flag, order) {
        if (flag === 1 && order === 'desc') {
          this.searchParams.order = `1:asc`
        } else if (flag === 1 && order === 'asc') {
          this.searchParams.order = `1:desc`
        } else if (flag === 2 && order === 'asc') {
          this.searchParams.order = `2:desc`
        } else if (flag === 2 && order === 'desc') {
          this.searchParams.order = `2:asc`
        } else {
          this.searchParams.order = `1:desc`
        }
        this.getData()
      }
    },
    //数据监听：监听组件实例身上的属性的属性值的变化
    watch: {
      //监听路由的信息是否发生变化，如果发生变化，再次发起请求
      $route(newValue, oldValue) {
        //再次发请求之前整理带给服务器参数
        Object.assign(this.searchParams, this.$route.query, this.$route.params)
        //再次发送请求
        this.getData()
        //每一次请求完毕，应该把相应的1、2、3级分类id置空
        this.searchParams.category1Id = ""
        this.searchParams.category2Id = ""
        this.searchParams.category3Id = ""
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                }

                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: 5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .attr a:hover {
                  color: red;
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }

              .list-wrap:hover {
                box-shadow: #cac7c7 0px 0px 10px;
              }
            }
          }
        }

        .page {
          width: 733px;
          height: 66px;
          overflow: hidden;
          float: right;

          .sui-pagination {
            margin: 18px 0;

            ul {
              margin-left: 0;
              margin-bottom: 0;
              vertical-align: middle;
              width: 490px;
              float: left;

              li {
                line-height: 18px;
                display: inline-block;

                a {
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  border: 1px solid #e0e9ee;
                  margin-left: -1px;
                  font-size: 14px;
                  padding: 9px 18px;
                  color: #333;
                }

                &.active {
                  a {
                    background-color: #fff;
                    color: #e1251b;
                    border-color: #fff;
                    cursor: default;
                  }
                }

                &.prev {
                  a {
                    background-color: #fafafa;
                  }
                }

                &.disabled {
                  a {
                    color: #999;
                    cursor: default;
                  }
                }

                &.dotted {
                  span {
                    margin-left: -1px;
                    position: relative;
                    float: left;
                    line-height: 18px;
                    text-decoration: none;
                    background-color: #fff;
                    font-size: 14px;
                    border: 0;
                    padding: 9px 18px;
                    color: #333;
                  }
                }

                &.next {
                  a {
                    background-color: #fafafa;
                  }
                }
              }
            }

            div {
              color: #333;
              font-size: 14px;
              float: right;
              width: 241px;
            }
          }
        }
      }
    }
  }
</style>
