<template>
  <div class="cart" v-show="cartInfoList">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cart,index) in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked"
                   @click="changeChecked(cart)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{cart.skuName}}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{cart.skuPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins"
               @click="changeValue('minus',20,cart)">-</a>
            <input autocomplete="off" type="text" :value="cart.skuNum" minnum="1" class="itxt"
                   @change="changeValue('change',$event.target.value*1,cart)">
            <a href="javascript:void(0)" class="plus"
               @click="changeValue('add',20,cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{oneProPrice(cart)}}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#" class="sindelet" @click.prevent="delPro(cart.skuId)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool" v-show="cartInfoList.length">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="allChecked" @click="allCheckeds">
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none" @click.prevent="delAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{numChecked}}</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{allPrice}}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" :to="`/trade`">结算</router-link>
        </div>
      </div>
    </div>
    <div v-show="!cartInfoList.length" class="none">购物车空空如也！</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import throttle from 'lodash/throttle'

  export default {
    name: 'ShopCart',
    mounted() {
      this.$store.dispatch('getCartList')
    },
    methods: {
      getData() {
        this.$store.dispatch('getCartList')
        this.$store.dispatch('getCartList')
      },
      //修改产品个数[节流]
      changeValue: throttle(function (type, num, cart, index) {
        let disNum = 0
        //先判断参数合不合法
        if (isNaN(num) || num < 1 || num > 200) {
          this.getData()
          return
        }
        switch (type) {
          case 'change':
            cart.skuNum = parseInt(cart.skuNum)
            disNum = num - cart.skuNum
            break
          case 'add':
            if (cart.skuNum < 200) {
              disNum = 1
            }
            break
          case 'minus':
            if (cart.skuNum > 1) {
              disNum = -1
            }
            break
        }
        this.$store.dispatch('getShopCart', {skuId: cart.skuId, skuNum: disNum})
        this.getData()
      }, 500),
      //全选触发单选操作[节流]
      allCheckeds: throttle(function (event) {
        let cartInfoList = this.cartInfoList
        if (cartInfoList.length > 0 && cartInfoList[0].isChecked === 1 && !event.target.checked) {
          for (let i = 0; i < cartInfoList.length; i++) {
            cartInfoList[i].isChecked = 0
            this.$store.dispatch('updateCart', {
              id: cartInfoList[i].skuId,
              isChecked: cartInfoList[i].isChecked
            })
          }
        } else {
          for (let i = 0; i < cartInfoList.length; i++) {
            cartInfoList[i].isChecked = 1
            this.$store.dispatch('updateCart', {
              id: cartInfoList[i].skuId,
              isChecked: cartInfoList[i].isChecked
            })
          }
        }
      },500),
      //删除商品
      delPro(id) {
        if (confirm("请确认要删除该商品吗？")) {
          this.$store.dispatch('delCart', id)
          this.getData()
        }
      },
      //计算单个商品的总价
      oneProPrice(cart) {
        if (isNaN(cart.skuNum * 1)) {
          return cart.skuPrice * 1
        } else if (cart.skuNum > 200) {
          return cart.skuPrice * 200
        } else {
          return cart.skuPrice * cart.skuNum
        }
      },
      //修改单个产品的选中状态
      changeChecked: throttle(function (cart){
        cart.isChecked === 1 ? cart.isChecked = 0 : cart.isChecked = 1
        this.$store.dispatch('updateCart', {
          id: cart.skuId,
          isChecked: cart.isChecked
        })
      },500),
      //删除全部选中的商品
      async delAllCheckedCart(){
        try{
          if(confirm("是否移除所有选中的商品?")){
            await this.$store.dispatch('delAllCheckedCart')
            this.getData()
          }
        }catch (error) {
          alert(error.message)
        }
      }
    },
    computed: {
      ...mapGetters(['cartList']),
      //选中的商品数量
      numChecked() {
        return this.cartInfoList.reduce((pre, cartInfo) => {
          return pre + (cartInfo.isChecked === 1 ? 1 : 0);
        }, 0);
      },
      //每个单选触发全选操作
      allChecked() {
        let cartInfoList = this.cartInfoList
        let j = 0
        for (let i = 0; i < cartInfoList.length; i++) {
          if (cartInfoList[i].isChecked === 1) {
            j++
          }
        }
        if (j === cartInfoList.length) {
          return 1
        } else {
          return 0
        }
      },
      //计算已经选中的商品的总价
      allPrice() {
        let allPrice = 0
        let cartInfoList = this.cartInfoList
        for (let i = 0; i < cartInfoList.length; i++) {
          if (cartInfoList[i].isChecked === 1) {
            if (isNaN(cartInfoList[i].skuPrice * cartInfoList[i].skuNum)) {
              allPrice += cartInfoList[i].skuPrice * 1
            } else if (cartInfoList[i].skuNum > 200) {
              allPrice += cartInfoList[i].skuPrice * 200
            } else {
              allPrice += cartInfoList[i].skuPrice * cartInfoList[i].skuNum
            }
          }
        }
        return allPrice
      },
      cartInfoList() {
        if (this.cartList[0] === undefined) {
          return []
        }
        return this.cartList[0].cartInfoList || []
      },
    },
  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        & > div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          & > li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }

          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }

          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
            }
          }
        }
      }
    }

    .none {
      text-align: center;
      color: red;
      font-size: 20px;
      margin-bottom: 15px;
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
