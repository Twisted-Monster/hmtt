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

// 频道--获取用户选择的频道（如果用户没有登陆则返回后台默认设置的频道）
export const getUSerChannelsAPI = () => request({
  url: '/v1_0/user/channels'
})

// 文章--获取文章列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) =>
  request({
    url: '/v1_0/articles',
    params: {
      channel_id, // 频道ID
      timestamp // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
    }
  })

// 文章 - 不感兴趣
export const dislikeArticleAPI = ({ target }) => {
  return request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: target
    }
  })
}
// 文章 - 举报
export const reportArticleAPI = ({ target, type, remark }) => {
  return request({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
      target: target,
      type: type,
      remark: remark
    }
  })
}
