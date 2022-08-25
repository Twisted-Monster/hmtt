// 统一封装接口方法
// 每个方法负责请求一个url地址
import request from '@/utils/request.js'
import { getStoragae } from '@/utils/storage'
// axios内部会把参数对象转成json格式发送后台
// axios内部会自动携带请求参数(Headers)里的Content-Type：application/json

// 既引入也同时向外按需导出，所有引入过来的方法(中转)
// export * from './ArticleDetail.js'

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
// 用户--刷新token
export const getNewTokenAPI = () =>
  request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      // 请求拦截器统一携带的是token，而这次请求需要携带的是refresh_token
      // 所以在axios请求拦截器里判断，就是为了这种情况准备的
      Authorization: 'Bearer ' + getStoragae('refresh_token')
    }
  })
// 用户--关注
export const userFollowedAPI = ({ userId }) =>
  request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: userId
    }
  })
// 用户--取关
export const userUnFollowedAPI = ({ userId }) =>
  request({
    url: `/v1_0/user/followings/${userId}`,
    method: 'DeLETE'
  })
// 用户--获取个人资料(编辑页面使用)
export const userProfileAPI = () =>
  request({
    url: '/v1_0/user/profile'
  })
// 用户--获取基本信息(home页面显示数据)
export const getUserInfoAPI = () =>
  request({
    url: '/v1_0/user'
  })
// 用户--更新头像
export const updateUserPhotoAPI = fd =>
  request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: fd // 外面传进来的FormData表单对象
    // Content-Type: application.json; axios携带的，前提：data请求体是对象->json字符串->发给后台
    // Content-Type：multipart/form-data;浏览器携带的，前提:data请求体必须是FormData类型对象
  })
// 用户--更新基本资料
export const updateUserProfileAPI = dataobj => {
  // 判断有什么值，再带什么参数给后台
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }
  for (const prop in obj) {
    // 遍历参数对象里的每个key
    if (dataobj[prop] === undefined) {
      // 用key去外面传入的参数对象匹配，如果没找到(证明外面没传这个值)
      delete obj[prop] // 从obj身上移除这对属性和值
    } else {
      obj[prop] = dataobj[prop]
    }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH', // 局部更新
    data: obj // name:昵称，gender:性别，birthday:生日(年-月-日 字符串)，intro:个人介绍
  })
}
// 频道--获取所有频道
export const getAllChannelsAPI = () =>
  request({
    url: '/v1_0/channels',
    method: 'GET'
  })

// 频道--获取用户选择的频道（如果用户没有登陆则返回后台默认设置的频道）
export const getUSerChannelsAPI = () =>
  request({
    url: '/v1_0/user/channels'
  })

// 频道--更新覆盖已选
export const updateChannelsAPI = ({ channels }) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
}

// 频道--删除指定用户的频道
export const removeTheChannelAPI = ({ channelId }) =>
  request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
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

// 文章--不感兴趣
export const dislikeArticleAPI = ({ target }) => {
  return request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: target
    }
  })
}
// 文章--举报
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
// 文章--获取详情
export const detailAPI = ({ artId }) =>
  request({
    url: `/v1_0/articles/${artId}`
  })
// 文章--点赞
export const likeArticleAPI = ({ artId }) =>
  request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target: artId
    }
  })
// 文章--取消点赞
export const unLikeArticleAPI = ({ artId }) =>
  request({
    url: `/v1_0/article/likings/${artId}`,
    method: 'DELETE'
  })
// 文章--获取评论列表
export const commentsListAPI = ({ id, offset = null, limit = 10 }) =>
  request({
    url: '/v1_0/comments',
    params: {
      // axios只针对params参数，如果发现键值对值为null会忽略此参数名和值不携带在url?后面
      type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      source: id, // 源id，文章id或评论id
      offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
    }
  })
// 文章--发布评论
export const commentSendAPI = ({ id, content, art_id = null }) => {
  // 形参art_id为可选参数，如果逻辑页面是对文章评论，则不需要传递art_id
  const obj = {
    target: id, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
    content // 评论内容
  }
  if (art_id !== null) {
    obj.art_id = art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}
// 搜索--联想菜单列表
export const suggestListAPI = ({ keywords }) =>
  request({
    url: '/v1_0/suggestion',
    params: {
      q: keywords
    }
  })
// 搜索--搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) =>
  request({
    url: '/v1_0/search',
    params: {
      page,
      per_page,
      q // page:页数，不传默认为1 per_page:每页数量，不传每页数量由后端决定 q:搜索关键词
    }
  })
// 评论--喜欢
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}
// 评论--取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}
