const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap:false, //打包去掉map文件
  //关闭eslint
  lintOnSave:false,
  //设置自动打开浏览器的配置
  devServer: {
    proxy: {
      '/api': {
        target: "http://gmall-h5-api.atguigu.cn"
      },
    }
  },
})
