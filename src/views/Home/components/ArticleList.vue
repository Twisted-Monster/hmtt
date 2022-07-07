<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <!-- 文章列表 immediate-check:是否在初始化时立即执行滚动位置检查-->
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :immediate-check="false"
    offset="50">
      <article-item
      v-for="obj in list"
      :key="obj.art_id"
      :artObj="obj"
      @dislike="dislikeFn"
      @report="reportsFn"></article-item>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from './ArticleItem'
import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import { Notify } from 'vant'

// 问题1：网页刚打开，created里请求和onload里请求同时发送，请求的都是最新数据
// onload中把两次一样的数据合并，造成数据重复导致key重复
// 原因：van-list组件，组件挂载时，默认就会判定一次是否触底
// 第一页数据也是网络请求回来的，标签先挂载了，数据回来更新DOM，所以标签没有高度，list的load事件上来就触发
// 解决方案1： list组件添加:immediate-check="false"上来初始化时不要判定
// 解决方案2： onload第一行，写数组长度的判断
export default {
  components: {
    ArticleItem
  },
  props: {
    /*  list: Array // 文章列表数组 */
    channelId: Number
  },
  data () {
    return {
      list: [],
      loading: false, // 底部加载状态
      finished: false, // 底部完成状态
      theTime: new Date().getTime(), // 当前时间
      isLoading: false
    }
  },
  async created () {
    this.getArticleListFn()
  },
  methods: {
    // 底部加载事件
    async onLoad () {
      if (this.list.length === 0) {
        this.loading = false
      }
      this.getArticleListFn()
    },
    // 顶部刷新数据事件
    async onRefresh () {
      this.list = []
      this.theTime = new Date().getTime()
      this.getArticleListFn()
    },
    // 专门负责发送请求
    async getArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })
      console.log(res)
      // pre_timestamp下一段开头的那篇文章的时间戳
      // 第一次 系统时间(timestamp) -> 后台返回0-9条数据 -> 携带第10条pre_timestamp值返回
      // 第二次 （timestamp）上一次pre_timestamp(意为从指定的时间戳再往后找10个 10-19条) 返回第20条的pre_timestamp
      // ......
      this.list = [...this.list, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp
      this.loading = false // 如果不关闭底部一直是加载中的状态
      if (res.data.data.pre_timestamp === null) { // 本次回来的数据是最后的
        this.finished = true
      }
      // 顶部加载状态改为false
      this.isLoading = false
    },
    // 反馈-不感兴趣
    async dislikeFn (obj) {
      // 如果用try+catch自己处理错误，内部throw就不会向控制台抛出打印错误，而是交给你的catch内自定义错误
      // try+catch捕获同步代码的异常
      try {
        const res = await dislikeArticleAPI({
          target: obj.art_id
        })
        console.log(res)
        Notify({ type: 'success', message: '反馈成功' })
      } catch (err) {
        console.log(err)
        Notify({ type: 'warning', message: '反馈失败' })
      }
    },
    // 反馈-举报
    async reportsFn (obj, type) {
      try {
        const res = await reportArticleAPI({
          target: obj.art_id,
          type: type,
          remark: '就是其他问题'
        })
        console.log(res)
        Notify({ type: 'success', message: '举报成功' })
      } catch (err) {
        console.log(err)
        Notify({ type: 'warning', message: '举报失败' })
      }
    }
  }
}
</script>
