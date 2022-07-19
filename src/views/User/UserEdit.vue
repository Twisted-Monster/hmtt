<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="$store.state.userPhoto" @click="imageClickFn" />
          <!-- file 选择框 -->
          <!-- v-show="false"视觉上隐藏，标签还在DOM树上，还可以触发功能 -->
          <!-- ref属性是vue操作DOM的一种方法 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profileObj.name" @click="nameClickFn" />
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="birthdayClickFn" />
    </van-cell-group>
    <!-- 姓名修改的弹窗 -->
    <van-dialog v-model="show" title="修改名称" show-cancel-button :before-close="beforeCloseFn">
      <!-- 事件触发的顺序mousedown - focus - mouseup - click -->
      <van-field v-model.trim="inputUserName" input-align="center" placeholder="请输入名称" maxlength="7" />
    </van-dialog>
    <!-- 弹出层包裹时间选择器 -->
    <van-popup v-model="popupShow" position="bottom" :style="{ height: '50%' }" round>
      <van-datetime-picker
      v-model="currentDate"
      type="date" title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="dateCancelFn"
      @confirm="confirmFn" />
    </van-popup>
  </div>
</template>

<script>
import { userProfileAPI, updateUserPhotoAPI, updateUserProfileAPI } from '@/api'
import Notify from '@/ui/Notify'
import { formatDate } from '@/utils/date'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  data () {
    return {
      profileObj: {}, // 用户基本资料
      show: false, // 控制姓名修改输入框的出现/隐藏
      inputUserName: '', // 用户姓名
      minDate: new Date(1920, 0, 1), // 最小范围
      maxDate: new Date(), // 最大范围(当前日期)
      currentDate: new Date(), // 当前
      popupShow: false // 弹出层的显示/隐藏
    }
  },
  async created () {
    const res = await userProfileAPI()
    console.log(res)
    this.profileObj = res.data.data
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']),
    // 文件--选择改变事件
    async onFileChange (e) {
      if (e.target.files.length === 0) return
      console.log(e.target.files[0])// (用户选中文件对象)数组其实是一个特殊的对象
      /* var objectURL = window.URL.createObjectURL(fileObj) 创建一个临时的对象URL */
      // 创建FormData对象
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0]) // 请求体里加入一对参数名和值，append(),在父级最后追加一个子元素
      const res = await updateUserPhotoAPI(theFd)
      console.log(res)
      this.profileObj.photo = res.data.data.photo
      this.SET_USERPHOTO(this.profileObj.photo) // 更新成功后，同步到vuex中
    },
    // 图片点击事件
    imageClickFn () {
      this.$refs.iptFile.click() // JS模拟标签事件的触发
    },
    // 姓名点击事件
    nameClickFn () {
      this.show = true
      this.inputUserName = this.profileObj.name
    },
    // 姓名--确认框--关闭前回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        // 点确定
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 通过了校验
          await updateUserProfileAPI({
            name: this.inputUserName
          })
          this.profileObj.name = this.inputUserName // 更新成功-回显到页面上
          done()
        } else {
          Notify({ type: 'warning', message: '用户名只能是1-7位中英数字的组合' })
          done(false)
        }
      } else {
        // 点取消
        done() // 调用 done() 后关闭弹窗，调用 done(false) 阻止弹窗关闭
      }
    },
    // 生日单元格-点击事件
    birthdayClickFn () {
      this.popupShow = true
      // 数据和页面显示->年-月-日格式的字符串
      // datetimePicker组件->日期对象
      this.currentDate = new Date(this.profileObj.birthday) // 显示默认的生日
    },
    // 日期选择器-取消时间确认
    dateCancelFn () {
      this.popupShow = false
    },
    // 日期选择器-完成时间确认
    async confirmFn () {
      await updateUserProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.profileObj.birthday = formatDate(this.currentDate) // 单元格同步
      this.popupShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
