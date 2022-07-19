// 基于 axios 封装的请求模块
import ajax from 'axios'
import Notify from '@/ui/Notify'
import { getToken, setToken } from '@/utils/token'
import { getNewTokenAPI } from '@/api'
import router from '@/router'
// 新建一个新的axios实例
const axios = ajax.create({
  baseURL: 'http://geek.itheima.net/' // 基地址
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 目标：统一携带token
  // 判断本地有token再携带，判断具体api/index.js里如果没有token再添加上去
  // 未定义为undefined
  // ?.可选链操作符，如果前面对象没有length，整个表达式原地返回undefined
  // 如果getToken()在原地有值token字符串，才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 只有401才代表身份过期，才需要跳转登陆
  if (error.response.status === 401) {
    // 不能使用this.$router(因为this不是vue组件对象所以无法调用$router)
    // 解决：用this.$router是为了拿到router路由对象，所以直接import @/router

    // token失效的处理方法

    // 方式一：强制跳转到登录页，用户有感知
    // removeToken() // 先清除token，才能让路由守卫判断失效，放行去登录页
    // router.currentRoute相当于在vue文件内this.$route -> 当前路由信息对象
    // fullpath：路由对象里完整路由路径#后面的一切
    // router.replace('/login')
    // Notify({ type: 'warning', message: '身份已过期' })

    // 方式二： 使用refresh_token换回新的token再继续使用，JS代码实现，用户无感知
    const res = await getNewTokenAPI()
    // 更新token在本地
    setToken(res.data.data.token)
    // 更新新的token在请求头里
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // 未完成的请求，再一次发起
    // error.config就是该请求的配置对象
    // 结果要return回原本逻辑页面调用地方
    return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // 刷新的refresh_token也过期了
    // localStorage.clear()
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
    Notify({ type: 'warning', message: '身份已过期' })
  }
  return Promise.reject(error)
})

// 导出自定义函数, 参数对象解构赋值
export default ({ url, method = 'GET', params, data, headers }) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
}
