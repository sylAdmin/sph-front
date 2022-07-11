//对于axios进行二次封装
import axios from "axios";
import nprogress from "nprogress"; //引入进度条
//start: 进度条开始 done：进度条结束
import 'nprogress/nprogress.css'

//1：利用axios对象的方法create，去创建一个axios实例
//2：service就是axios，只不过稍微配置了一下
const service = axios.create({
  //配置对象
  //基础路径，发送请求的时候，路径当中会出现api
  baseURL: '/mock',
  //代表请求超时的时间5s
  timeout: 5000,
});

//请求拦截器
service.interceptors.request.use((config) => {
  //config：配置对象，对象里面有一个属性很重要，header请求头

  //进度条开始动
  nprogress.start()
  return config;
});

//响应拦截器
service.interceptors.response.use((response) => {
  //成功的回调函数：服务器相应数据回来以后，响应拦截器可以检测到，可以做一些事情
  //进度条结束
  nprogress.done()
  return response.data
}, (error) => {
  //响应失败的回调函数
  Promise.reject(error)
})

//对外暴露
export default service;
