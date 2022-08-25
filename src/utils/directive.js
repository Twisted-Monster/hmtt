// 对Vue的全局指令进行封装

// 封装中间件函数插件
const directiveObj = {
  install(Vue) {
    // 注册一个全局自定义指令 v-fofo
    /* 在ios中，想要触发键盘，只能是用户手动的选择事件 才能弹出键盘。
    这是ios的安全机制。应该避免用户不是直接操作的方法来获取 input 焦点。 */
    Vue.directive('fofo', {
      // 当绑定元素插入到DOM时触发，如果标签用display：none隐藏再出现，不会触发inserted
      inserted(el) {
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
      update(el) {
        // 指令所在标签被更新时触发
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
export default directiveObj
