import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search, Image as VanImage, Divider, CellGroup, Tag, Dialog, DatetimePicker } from 'vant'

Vue.use(DatetimePicker)
// 全局注册
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
Vue.config.productionTip = false

// 封装中间件函数插件
const directiveObj = {
  install (Vue) {
    // 注册一个全局自定义指令 v-fofo
    /* 在ios中，想要触发键盘，只能是用户手动的选择事件 才能弹出键盘。
    这是ios的安全机制。应该避免用户不是直接操作的方法来获取 input 焦点。 */
    Vue.directive('fofo', {
      // 当绑定元素插入到DOM时触发，如果标签用display：none隐藏再出现，不会触发inserted
      inserted (el) {
        // 搜索页面--el是div
        // 文章评论--el是textarea
        // 知识点：原生DOM.nodeName拿到标签名字(注意：大写的字符串)
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身本身不是输入框，尝试往里面获取一下
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      },
      update (el) { // 指令所在标签被更新时触发
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身本身不是输入框，尝试往里面获取一下
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      }
    })
  }
}
// 执行目标对象里install方法并传入Vue类
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
