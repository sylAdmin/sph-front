import { v4 as uuidv4 } from 'uuid';
//生成一个随机字符串，且每次执行不能发生变化，游客身份持久化存储
export const getUUID = () => {
  //先从本地获取uuid，有的话直接返回
  let uuid_token = localStorage.getItem('UUIDTOKEN')
  //本地没有在生成
  if(!uuid_token){
    //生成游客临时身份
    uuid_token = uuidv4()
    //本地持久化存储
    localStorage.setItem('UUIDTOKEN',uuid_token)
  }
  //切记有返回值，没有返回值undefined
  return uuid_token
}
