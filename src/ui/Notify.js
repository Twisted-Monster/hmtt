// 基于vant进行的二次封装
// 封装通知的方法

// import { Notify } from 'vant'
// export default Notify
import { Toast } from 'vant'
// 外面逻辑页面传入的字段，用自定义函数解构赋值形参中转接收
// 内部如何使用和传值，在这个函数体里自己决定
export default ({ type, message }) => {
  if (type === 'danger') {
    type = 'fail' // Toast失败图标叫fail
  }
  Toast({ type, message })
}
