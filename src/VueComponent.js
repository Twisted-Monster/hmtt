import Vue from 'vue'
import {
  NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon,
  Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search,
  Image as VanImage, Divider, CellGroup, Tag, Dialog, DatetimePicker, Loading, Lazyload
} from 'vant'

Vue.use(Lazyload, {
  preLoad: 0.8, // 预加载的范围
  // 错误时的图片
  error: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.Vg2IHmNGc4xBQStFdtj-nAHaDP?w=289&h=153&c=7&r=0&o=5&dpr=1.25&pid=1.7'
})
Vue.use(Loading)
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
