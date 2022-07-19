<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search
      placeholder="请输入搜索关键词"
      background="#007BFF"
      shape="round"
      v-fofo
      @input="inputFn"
      v-model.trim="kw"
      @search="searchFn"/>
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
      class="sugg-item"
      v-for="(str,index) in suggestList"
      :key="index"
      v-html="lightFn(str,kw)"
      @click="suggestClickFn(str)"></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"/>
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(str,index) in history" :key="index" @click="historyClickFn(str)">{{str}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 目标1：跳转到搜索结果页面
// 1. 输入框回车->输入框字->搜索结果页
// 2. 点击联想菜单->点击文字->搜索结果页
// 3.点击历史记录->点击文字->搜索结果页
import { suggestListAPI } from '@/api'
import { getStorage, setStorage } from '@/utils/storage'

export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖的定时器
      suggestList: [], // 联想建议列表
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
    }
  },
  methods: {
    // 输入框-内容实时改变触发方法
    inputFn () {
      // 防抖：延时执行逻辑代码，事件再次触发时清除上一个定时器
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          const res = await suggestListAPI({
            keywords: this.kw
          })
          console.log(res.data.data.options)
          if (res.data.data.options.length !== 1) { // 数组不为空
            this.suggestList = res.data.data.options
          }
        }, 300)
      }
    },
    // 字符串高亮关键字
    lightFn (originStr, target) {
      // originStr: 原来字符串
      // target： 关键字
      // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
      // 如果想使用变量作为正则的匹配条件，不能使用语法糖简化写法
      const reg = new RegExp(target, 'ig')// i忽略大小写 g全局匹配
      // 替换后的值不能用target
      // 例如： 输入框了java，匹配回来的Java，IAVA都被replace为java
      return originStr.replace(reg, (match) => {
        // match就是匹配中时，原字符串里的那个字符
        return `<span style="color:red">${match}</span>`
      })
    },
    // 跳转到搜索结果方法
    moveFn (theKw) {
      // 路由跳转传参
      // 方式1： 路径/值(前提：路由规则：变量名) -> 接收:$route.params
      // 方式2： 路径？参数名=值 -> 接收:$route.query
      // 这两种规则，你都可以自己在path路径后进行拼接
      // 也可以用$router.push配置项里的params和query让js代码进行拼接

      // 注意：路由跳转在watch之前执行，所以要用一个定时器包裹，让跳转最后执行
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${theKw}`
        }, 0)
      })
    },
    // 输入框搜索事件
    searchFn () {
      if (this.kw.length > 0) {
        // 搜索关键字-保存到数组里
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
    },
    // 联想菜单-点击事件
    suggestClickFn (str) {
      // 搜索关键字-保存到数组里
      this.history.push(str)
      this.moveFn(str)
    },
    // 搜索历史-点击事件
    historyClickFn (str) {
      this.moveFn(str)
    },
    // 清除搜索历史
    clearFn () {
      this.history = []
    }
  },
  // wtch侦听器使用
  watch: {
    history: { // 历史记录数组的改变
      deep: true,
      handler () {
      // 立刻覆盖式的保存到本地
      // ES6新增了两种引用类型(以前Array,Object),(新增 Set,Map)
      // 特点：你传入的数组类型，如果有重复元素，会自动清理掉重复元素，返回无重复的Set对象
        const theSet = new Set(this.history)
        // Set类型对象->Array数组类型
        const arr = Array.from(theSet)
        setStorage('his', JSON.stringify(arr)) // 浏览器本地只能存字符串
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
