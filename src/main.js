import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import 'highlight.js/styles/default.css' // 文章中的代码高亮显示
import directiveObj from '@/utils/directive' // 封装自定义指令
import '@/VueComponent' // vant组件库的注册
Vue.config.productionTip = false

// 执行目标对象里install方法并传入Vue类
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
