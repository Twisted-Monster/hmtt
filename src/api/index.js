// 统一封装接口方法
// 每个方法负责请求一个url地址
import request from '@/utils/request.js'

// axios内部会把参数对象转成json格式发送后台
// axios内部会自动携带请求参数(Headers)里的Content-Type：application/json

// 登陆--登陆接口
export const loginAPI = ({ mobile, code }) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}

// 频道--获取所有频道
export const getAllChannelsAPI = () =>
  request({
    url: '/v1_0/channels',
    method: 'GET'
  })
