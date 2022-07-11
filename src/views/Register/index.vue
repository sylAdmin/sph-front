<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>注册新用户
        <span class="go">我有账号，去 <router-link :to="`/login`">登陆</router-link>
        </span>
      </h3>
      <div class="content">
        <label>昵称:</label>
        <input type="text" placeholder="请输入你的昵称" v-model="params.nickname">
      </div>
      <div class="content">
        <label>手机号:</label>
        <input type="text" placeholder="请输入你的手机号" v-model="params.mobile">
        <!--        <span class="error-msg">错误提示信息</span>-->
      </div>
      <div class="content">
        <label>验证码:</label>
        <input type="text" placeholder="请输入验证码" v-model="params.code">
        <button class="buttCode" @click.prevent="getCode"
                :disabled="isDis" v-show="!isDis">获取验证码
        </button>
        <button class="buttCode" v-show="isDis" :disabled="isDis">{{time}}s
        </button>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input type="password" placeholder="请输入你的登录密码" v-model="params.password">
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input type="password" placeholder="请输入确认密码" v-model="params.password2">
      </div>
      <div class="controls">
        <input name="m1" type="checkbox" :checked="agree">
        <span>同意协议并注册《尚品汇用户协议》</span>
      </div>
      <div class="btn">
        <button @click="userRegister">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Register',
    data() {
      return {
        params: {  //封装注册输入的数据
          mobile: '', //手机号
          code: '', //验证码
          nickname: '', //昵称
          password: '', //密码
          password2: '',
        },
        agree: true, //是否同意
        isDis: false,
        time: 60,
        timer: ''
      }
    },
    methods: {
      //发送验证码
      async getCode() {
        if (!this.params.mobile) {
          this.$message({
            type: 'error',
            message: "请输入手机号"
          })
          return
        }
        let res = await this.$store.dispatch('getCode', this.params.mobile)
        if (res.code !== 20000) {
          this.$message({
            message: res.message,
            type: 'error',
          })
        } else {
          this.isDis = true
          this.timer = setInterval(() => {
            this.time -= 1
          }, 1000)
        }
      },
      //用户注册
      async userRegister() {
        if (this.params.password !== this.params.password2) {
          this.$message({
            type: 'error',
            message: "密码不一致"
          })
          this.params.password = ''
          this.params.password2 = ''
        }
        else if (!this.params.nickname && !this.params.mobile && !this.params.code) {
          this.$message({
            type: 'error',
            message: "参数不能为空"
          })
        }
        else {
          let res = await this.$store.dispatch('userRegister', this.params)
          if (res.code !== 20000) {
            this.$message({
              message: res.message,
              type: 'error',
            })
          }
          else {
            this.$message({
              message: "注册成功",
              type: 'success',
            })
            this.$router.push("/login")
          }
        }
      }
    },
    watch: {
      time: {
        handler(newValue, oldValue) {
          if (this.time <= 0) {
            clearInterval(this.timer)
            this.isDis = false
            this.time = 60
          }
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
  }
</script>

<style lang="less" scoped>
  .register-container {
    .register {
      width: 1200px;
      height: 445px;
      border: 1px solid rgb(223, 223, 223);
      margin: 0 auto;

      h3 {
        background: #ececec;
        margin: 0;
        padding: 6px 15px;
        color: #333;
        border-bottom: 1px solid #dfdfdf;
        font-size: 20.04px;
        line-height: 30.06px;

        span {
          font-size: 14px;
          float: right;

          a {
            color: #e1251b;
          }
        }
      }

      div:nth-of-type(1) {
        margin-top: 40px;
      }

      .content {
        padding-left: 390px;
        margin-bottom: 18px;
        position: relative;

        label {
          font-size: 14px;
          width: 96px;
          text-align: right;
          display: inline-block;
        }

        input {
          width: 270px;
          height: 38px;
          padding-left: 8px;
          box-sizing: border-box;
          margin-left: 5px;
          outline: none;
          border: 1px solid #999;
        }

        img {
          vertical-align: sub;
        }

        .error-msg {
          position: absolute;
          top: 100%;
          left: 495px;
          color: red;
        }
      }

      .controls {
        text-align: center;
        position: relative;

        input {
          vertical-align: middle;
        }

        .error-msg {
          position: absolute;
          top: 100%;
          left: 495px;
          color: red;
        }
      }

      .btn {
        text-align: center;
        line-height: 36px;
        margin: 17px 0 0 55px;

        button {
          outline: none;
          width: 270px;
          height: 36px;
          background: #e1251b;
          color: #fff !important;
          display: inline-block;
          font-size: 16px;
        }
      }
    }

    .buttCode {
      right: 440px;
      top: 6px;
      position: absolute;
      width: 80px;
      height: 28px;
      border: 0;
      font-size: 13px;
      background-color: #fff;
      color: #4e6ef2;
      cursor:pointer;
    }

    .buttDis {
      cursor: not-allowed;
    }

    .copyright {
      width: 1200px;
      margin: 0 auto;
      text-align: center;
      line-height: 24px;

      ul {
        li {
          display: inline-block;
          border-right: 1px solid #e4e4e4;
          padding: 0 20px;
          margin: 15px 0;
        }
      }
    }
  }
</style>
