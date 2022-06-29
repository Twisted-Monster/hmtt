<template>
  <div>
    <van-nav-bar title="黑马头条-登陆" />
    <div>
      <van-form @submit="onSubmit">
        <van-field v-model="user.mobile"
        required name="mobile" label="手机号"
        placeholder="请输入11位手机号"
        :rules="[{ required: true, message: '请填写正确的手机号',pattern:/^1[3-9]\d{9}$/ }]" />
        <van-field v-model="user.code"
        required type="password"
        name="code" label="密码"
        placeholder="请输入6位密码"
        :rules="[{ required: true, message: '请填写正确的密码',pattern:/^\d{6}$/ }]" />
        <div style="margin: 16px">
          <!-- 属性不给值默认为ture -->
          <van-button round block type="info"
           native-type="submit"
           :loading = "isLoading"
           :disabled = "isLoading"
           loading-text="登陆中...">登陆</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { Notify } from 'vant'
import { setToken } from '@/utils/token'
export default {
  data () {
    return {
      user: {
        mobile: '13811111111', // 手机号
        code: '246810' // 验证码（密码）必须是246810
      },
      isLoading: false // 登陆按钮的加载状态
    }
  },
  methods: {
    async onSubmit () {
      this.isLoading = true // 网络请求正在加载
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'success', message: '登陆成功' })
        setToken(res.data.data.token)
        // location.href->当前地址和要跳转的地址(不包含#后面的内容)一样不会刷新网页。地址改变则会刷新
        // 跳转一定要写到最后，尽量最后执行
        this.$router.push({ path: '/layout/home' })
      } catch (error) {
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoading = false // 网络请求完成
    }
  }
}
</script>
<style scoped lang="less"></style>
