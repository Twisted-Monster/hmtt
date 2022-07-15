<template>
  <div>
    <!-- 评论列表 -->
    <!-- van-list最好在这个div内，让底部文字/加载中，作为此div的内容，容器padding-bottom底部文字也挤上去 -->
    <div class="cmt-list" :class="{'art-cmt-container-1': isShowCmtBox,'art-cmt-container-2':!isShowCmtBox}">
      <!-- van-list包裹列表，组件内源码检测网页滚动事件，判断滚动位置是否快要到达内容高度(触底)
      触发load事件->loading为true，底部加载中文字出现 -->
      <!-- immediate-check作用：让list组件不要上来就检查是否触底
      原因：list中列表内容是异步网络请求回来的，标签挂载时。没有高度，list就会判定触底执行一次onLoad方法
      问题：created发一次请求，onLoad立刻有发一次，请求两次第一页的数据/请求第一第二页的数据 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多评论了" @load="onLoad" :immediate-check="false">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar">
              <span class="uname">{{obj.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="obj.is_liking" @click="likeFn(true,obj)" />
              <van-icon name="like-o" size="16" color="gray" v-else @click="likeFn(false,obj)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{obj.content}}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{timeAgo(obj.pudate)}}</div>
        </div>
      </van-list>
    </div>
    <!-- 发表评论 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtBox === true">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="commentClickFn" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-fofo @blur="blurFn" v-model.trim="comText"></textarea>
        <van-button type="default" :disabled="comText.length === 0" @click="sendFn">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { commentsListAPI, commentLikingAPI, commentDisLikingAPI, commentSendAPI } from '@/api'
import { timeAgo } from '@/utils/date'
export default {
  data () {
    return {
      offset: null, // 偏移量评论ID
      commentArr: [], // 评论列表
      totalCount: 0, // 评论总数
      isShowCmtBox: true, // 底部显示短的还是高的评论容器
      comText: '', // 发布评论的内容
      loading: false,
      finished: false,
      lastId: null
    }
  },
  async created () {
    const res = await commentsListAPI({
      id: this.$route.query.art_id // 文章id
    })
    console.log(res)
    this.commentArr = res.data.data.results
    this.totalCount = res.data.data.total_count // 评论总数
    this.lastId = res.data.data.last_id // 分页
    // 网页打开->没有评论，res结果空数组
    if (res.data.data.results.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    // 点赞/取消点赞评论
    async likeFn (bool, commentObj) {
      if (bool === true) {
        // 点击变为不喜欢
        commentObj.is_liking = false
        await commentDisLikingAPI({
          comId: commentObj.com_id
        })
      } else {
        // 点击变为喜欢
        commentObj.is_liking = true
        await commentLikingAPI({
          comId: commentObj.com_id
        })
      }
    },
    // 显示评论输入框--第二套
    toggleShowFn () {
      this.isShowCmtBox = false
    },
    // 评论按钮--点击事件->把第一条评论滑动到最上面
    commentClickFn () {
      // Y轴滚动文章内容的距离
      // JS代码是在html+css运行后执行，真实DOM已经在网页上，从document往下获取标签是可行的
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // window.scrollTo()使网页进行滚动，设置想要的坐标，就可以让网页滚动到屏幕的最顶端
      // 如果底下没有内容了，则不再滚动
      // window.scrollTo(0, articleHeight)
      // JS做动画：计时器间隔时间，修改目标状态

      // 比较方便的方法(既能滚动也能带动画)
      // 原生标签.scrollIntoView(),让原生的标签滚动到屏幕的最上面
      // 选择like-box而不是第一条评论，因为头部导航会挡住
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布按钮--点击事件
    async sendFn () {
      const res = await commentSendAPI({
        id: this.$route.query.art_id,
        content: this.comText
      })
      console.log(res)
      this.commentArr.unshift(res.data.data.new_obj)
      this.totalCount++
      this.comText = ''
      this.commentClickFn() // 把第一条评论滑动到最上面
    },
    // 输入框--失去焦点
    blurFn () {
      // 问题：点击发布按钮时，发现点击事件不执行
      // 原有：高的评论容器--在页面点击发布的一瞬间，输入框失去了焦点，被v-if和v-else移除了整个标签，导致点击事件来不及执行
      // 解决：让失去焦点的方法最后执行
      setTimeout(() => {
        this.isShowCmtBox = true
      }, 0)
    },
    // 底部加载更多
    async onLoad () {
      // imediate-check：内部不要进行判断而已，监听滚动事件的代码还在
      // 第一个滚动到底部，再切换到第二个频道的时候（新建内容没有那么高），滚动会从底部滚动会顶部
      // 这个时候发生了滚动，所以滚动事件还是出发了，immediate-check判断无效
      if (this.commentArr.length > 0) {
        const res = await commentsListAPI({
          id: this.$route.query.art_id, // 文章id
          offset: this.lastId
        })
        console.log(res)
        this.commentArr = [...this.commentArr, ...res.data.data.results]
        this.totalCount = res.data.data.total_count // 评论总数
        this.lastId = res.data.data.last_id // 分页
        if (res.data.data.last_id === null) { this.finished = true }
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
