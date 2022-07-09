<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 文章列表 -->
    <div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <ArticleItem v-for="obj in articleList" :key="obj.id" :artObj="obj" :isShow="false"></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem'
import { searchResultAPI } from '@/api'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页码
      articleList: [], // 文章列表
      loading: false, // 加载状态
      finished: false // 是否全部加载完成
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    console.log(res)
    this.articleList = res.data.data.results
  },
  methods: {
    async onLoad () {
      this.page++
      const res = await searchResultAPI({
        page: this.page,
        q: this.$route.params.kw
      })
      if (res.data.data.results.length === 0) {
        // 没有更多数据
        this.finished = true
        return
      }
      console.log(res)
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.loading = false
    }
  }
}
// 后端保存文章的数据，文章里的图片来自于其他服务器路径的cnblog(图片的第三方)，后端只是保存了图片的地址
// 后端会把数据和图片返回给前端，前端铺设页面。 用img标签->第三方图片(403/404)
// 404 无法解决 -> 后台换图(前端只能给个占位图提示)
// 403 你无权去请求此地址->后端做了图片的防盗链
// 防止你用img标签来请求此图片
// 后端会判断请求时，Reffer字段的来源是不是自己的地址
// 解决：<meta name="referrer" content="no-referrer" />,不让浏览器携带请求头里的reffer，让后端判断失效
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
