import { getToken } from '@/utils/token'
import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit'
// import Chat from '@/views/Chat'
Vue.use(VueRouter)

// 路由懒加载：为了让第一个页面加载的app.js小一点，打开网页快一点
// 思路：把组件对应js分成若干个.js，路由切换到哪个页面，才去加载对应的.js文件
// 原因：webpack分析入口时，发现router里上来就有页面，所以打包进app.js很大
// 解决：当路由匹配规则时，才去import对应的组件文件

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
    // 路由独享守卫
    beforeEnter(to, from, next) {
      // 如果已经登陆了，不要切换到登录页面
      if (getToken()?.length > 0 && to.path === '/login') {
        // next(false) // 留在原地,原理是跳到login后再跳回当前页面，会使当前页面的返回失效
        // 想要进登录页不留再原地了，而是返回首页
        next('/layout/home')
      } else {
        next() // 其他情况放行
      }
    }
  },
  {
    path: '/layout',
    redirect: '/layout/home',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
        // 首页->滚动位置保存
        // 问题：首页滚动一些，点击我的再切回来，为何滚动条回到了顶部？
        // 疑惑：组件缓存keep-alive保存组件标签+样式+js遍历，不会保存滚动位置
        // 原因：切换到我的页面，页面高度不够，没有滚动条（滚动条属于整个网页）
        // 滚动位置会回到顶部，切回首页后，只是内容改变了，滚动条还在顶部
        // 解决：滚动时实时的保存
        meta: {
          scrollT: 0 // 保存首页离开时，滚动条位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  // 搜索结果页
  {
    path: '/search_result/:kw',
    component: () =>
      import(
        /* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult'
      )
  },
  // 文章详情页
  {
    path: '/detail',
    component: () =>
      import(
        /* webpackChunkName: "ArticleDetailDetail" */ '@/views/ArticleDetail'
      )
  },
  {
    // 用户编辑页面
    path: '/user_edit',
    component: () =>
      import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit')
  },
  {
    // 聊天页面
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// // 路由--全局前置守卫(在路由发生真正跳转之前，执行此函数)
// // 此函数可以决定路由是否跳转/取消/强制中断切换到别的路由
// router.beforeEach((to, from, next) => {
//   // 如果已经登陆了，不要切换到登录页面
//   if (getToken()?.length > 0 && to.path === '/login') {
//     next(false) // 留在原地
//   } else {
//      // next(false) // 留在原地,原理是跳到login后再跳回当前页面，会使当前页面的返回失效
//      next('/layout/home')
//   }
// })

export default router
