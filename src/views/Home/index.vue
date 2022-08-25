<template>
  <div>
    <!-- 头部导航  -->
    <div>
      <van-nav-bar fixed>
        <template #left>
          <img class="logo" src="@/assets/toutiao_logo.png" />
        </template>
        <template #right>
          <van-icon
            name="search"
            size="0.48rem"
            color="#fff"
            @click="moveSearchPageFn"
          />
        </template>
      </van-nav-bar>
    </div>

    <div>
      <!-- tab栏导航
         v-tabs一行容器
         v-tab每一项
         v-model激活项-->
      <!-- 被定位的头部导航挡住, 给tabs设置固定定位/粘性定位, 距离上边46px(手动转rem) -->
      <van-tabs
        v-model="channelId"
        sticky
        offset-top="1.226667rem"
        animated
        @change="channelChangeFn"
      >
        <!-- 每个van-tab代表一个标签导航，中间夹着的内容对应下属列表内容 -->
        <!-- 在标签指定 name 属性的情况下，v-model 的值为当前标签的 name（此时无法通过索引值来匹配标签） -->
        <van-tab
          :title="obj.name"
          v-for="obj in userChannelList"
          :key="obj.id"
          :name="obj.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="showPopup"
      />
    </div>
    <!-- 频道管理的弹出层 -->
    <van-popup v-model="show" get-container="body" class="channel_popup">
      <ChannelEdit
        :userList="userChannelList"
        :unCheckList="unCheckChannelList"
        @addChannelEV="addChannelFn"
        @removeChannelEV="removeChannelFn"
        @closeEV="closeFn"
        ref="editRef"
        v-model="channelId"
      ></ChannelEdit>
    </van-popup>
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

import {
  getUSerChannelsAPI,
  getAllChannelsAPI,
  updateChannelsAPI,
  removeTheChannelAPI
} from '@/api'
import ArticleList from './components/ArticleList'
import ChannelEdit from './ChannelEdit'
export default {
  data() {
    return {
      channelId: 0, // 激活频道id
      userChannelList: [], // 用户选择的频道
      allChannelList: [], // 所有的频道
      show: false, // 控制弹出层是否展示
      channelScrollTObj: {} // 保存每个频道的滚动位置 { 推荐频道ID:滚动距离 }
    }
  },
  async created() {
    // 用户选择的频道
    const res1 = await getUSerChannelsAPI()
    console.log(res1)
    this.userChannelList = res1.data.data.channels
    // 所有频道
    const res2 = await getAllChannelsAPI()
    console.log(res2)
    this.allChannelList = res2.data.data.channels
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    // tab栏切换事件
    channelChangeFn() {
      // tab切换后，设置滚动条位置
      // tab切换时，这个组件内部，会把切走的容器的height设置为0，滚动条应为没有高度回到了顶部
      // 切回来的一瞬间，没有高度，滚动条回到顶部同时对象里的值也被设置为0
      // tab栏切换事件比滚动事件先执行，但是切换瞬间容器高度为0，给它赋值也没效果
      // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调
      this.$nextTick(() => {
        document.documentElement.scrollTop =
          this.channelScrollTObj[this.channelId]
      })
    },
    // +号点击方法
    showPopup() {
      this.show = true
    },
    // 添加频道
    async addChannelFn(channelObj) {
      this.userChannelList.push(channelObj)
      // 把最新的数组发送给后台
      /* forEach() 方法对数组的每个元素执行一次给定的函数
         delete 对象.属性 可以删除键值对（此处用不到）
         forEach()会修改原来的数组。而map()方法会得到一个新的数组并返回。 */
      const res = await updateChannelsAPI({
        channels: this.userChannelList
      })
      console.log(res)
    },
    // 删除频道
    async removeChannelFn(channelObj) {
      const index = this.userChannelList.findIndex(
        obj => obj.id === channelObj.id
      )
      this.userChannelList.splice(index, 1)
      // 第一种方式：把现在用户数组的数据，再覆盖式的发给后台
      // 需要把上面的更新数组过程，封装一个函数，add和remove里调用
      // 第二种方式：只调用删除的接口
      try {
        const res = await removeTheChannelAPI({
          channelId: channelObj.id
        })
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 关闭弹出层
    closeFn() {
      this.show = false
      // 让内部的编辑状态回归false
      /* ref 被用来给元素或子组件注册引用信息， 引用信息将会注册在父组件的 $refs 对象上，
         如果是在普通的DOM元素上使用，引用指向的就是 DOM 元素，如果是在子组件上，引用就指向组件的实例。
         $refs 是一个对象，持有已注册过 ref 的所有的子组件。 */
      this.$refs.editRef.isEdit = false
    },
    // 首页-右上角放大镜点击事件->跳转到搜索界面
    moveSearchPageFn() {
      this.$router.push('/search')
    },
    // 页面滚动事件
    scrollFn() {
      // 当前路由的滚动距离
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 同时保存当前频道的滚动距离
      this.channelScrollTObj[this.channelId] =
        document.documentElement.scrollTop
    }
  },
  computed: {
    // 用户未选择的频道
    unCheckChannelList() {
      /* filter用于把Array的某些元素过滤掉，然后返回剩下的元素。
      filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素。 */
      /* findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回-1 */
      /* 简化写法：return this.allChannelList.filter(bigObj => (this.userChannelList.findIndex(smallObj.id===bigObj.id)===-1)) */
      const newArr = this.allChannelList.filter(bigObj => {
        // 找索引
        const index = this.userChannelList.findIndex(smallObj => {
          return smallObj.id === bigObj.id
        })
        // 找到了
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  activated() {
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated() {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
/* tab内容距离tab导航的距离 */
/* van-tabs__content是vant的组件库里的子组件，没有父组件的自定义属性*/
/deep/ .van-tabs__content {
  padding-top: 44px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.channel_popup {
  //如果想给100%，要先给html和body设置100%
  //vw和vh是css3新出的单位，参考浏览器窗口的百分比
  width: 100vw;
  height: 100ch;
}
</style>
