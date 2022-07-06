<template>
  <div>
    <!-- 头部导航  -->
    <div>
      <van-nav-bar fixed>
        <template #left>
          <img class="logo" src="@/assets/toutiao_logo.png" />
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#fff" />
        </template>
      </van-nav-bar>
    </div>

    <!-- tab栏导航
         v-tabs一行容器
         v-tab每一项
         v-model激活项-->
      <!-- 被定位的头部导航挡住, 给tabs设置固定定位/粘性定位, 距离上边46px(手动转rem) -->
      <van-tabs v-model="chanelId" sticky offset-top="1.226667rem" animated @change="channelChangeFn">
        <!-- 每个van-tab代表一个标签导航，中间夹着的内容对应下属列表内容 -->
        <!-- 在标签指定 name 属性的情况下，v-model 的值为当前标签的 name（此时无法通过索引值来匹配标签） -->
        <van-tab :title="obj.name" v-for="obj in userChannelList" :key ="obj.id" :name="obj.id">
          <ArticleList :channelId="chanelId"></ArticleList>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
// 目标1:获取不同的文章列表，需要传递不同的频道ID
// 想法：让van-tabs的v-model关联频道ID

// 目标2：点击tab标签页触发change事件，重新发送请求，拿到新数据
// 问题：每次切换tab拿到的数据都是新的，即时用keep-alive也没用（防止组件被销毁，而组件没有被销毁，是在点击切换数据）
// 解决：外面限制用的是同一个数组切换数据（多个ArticleList用的是同一个数组，换会影响到别人），所以要自己请求自己的数据
// 细节：van-tab循环了很多标签导航，与之一一对应的内容列表不是上来都创建的，默认创建当前激活导航对应列表组件
// 第一次切换到对应频道时，才会创建下属的ArticleList组件，第二次切换就是显示/隐藏切换

import { getUSerChannelsAPI } from '@/api'
import ArticleList from './components/ArticleList'
export default {
  data () {
    return {
      chanelId: 0, // 激活频道id
      userChannelList: [] // 用户选择的频道
      /*  articleList: [] */
    }
  },
  async created () {
    const res1 = await getUSerChannelsAPI()
    console.log(res1)
    this.userChannelList = res1.data.data.channels
    /*  this.channelChangeFn() */
  },
  components: {
    ArticleList
  },
  methods: {
    // tabs切换的事件 -> 获取文章数据列表
    async channelChangeFn () {
      /*  const res2 = await getAllArticleListAPI({
        channel_id: 0,
        timestamp: (new Date()).getTime()
      })
      console.log(res2)
      this.articleList = res2.data.data.results
    } */
    }
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
/* tab内容距离tab导航的距离 */
/deep/ .van-tabs__content{
    padding-top: 44px;
}
</style>
