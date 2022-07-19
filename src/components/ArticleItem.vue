<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{artObj.title}}</span>
          <!-- 单图 -->
          <img v-if="artObj.cover.type === 1" v-lazy="artObj.cover.images[0]" alt="" class="thumb">
          <!-- <van-image v-if="artObj.cover.type === 1" :src="artObj.cover.images[0]" alt="" class="thumb">
            <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
        <!-- 多图 -->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <img v-lazy="imgUrl" alt="" class="thumb" v-for="(imgUrl,index) in artObj.cover.images" :key="index">
          <!-- <van-image :src="imgUrl" alt="" class="thumb" v-for="(imgUrl,index) in artObj.cover.images" :key="index">
            <template v-slot:error>加载失败</template>
          </van-image> -->
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{artObj.aut_name}}</span>
            <span>{{artObj.comm_count}}</span>
            <span>{{formateTime(artObj.pubdate)}}</span>
          </div>
          <!-- 反馈按钮 -->
          <!-- @click.stop阻止点击事件冒泡到父级执行跳转 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <!-- 弹出层默认挂载到组件所在位置，可以通过 get-container 属性指定挂载位置。 -->
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" @cancel="cancelFn" @close="closeFn" get-container="body" :cancel-text="bottomText" />
  </div>
</template>

<script>
// 目标1：点击”反馈垃圾内容“数据的切换
// 1.监听点击事件，区分用户点击的是哪一个
// 2.切换actions数组里数据

// 目标2：二级反馈数据出现，取消按钮的文字要换成”返回“
import { timeAgo } from '@/utils/date'
import { firstActions, secondActions } from '@/api/reports'
export default {
  props: {
    artObj: Object, // 文章对象
    isShow: { // 控制x是否显示
      type: Boolean,
      default: true // 首页之类的地方不想再做修改，首页没传值进来所以默认显示
    }
  },
  methods: {
    formateTime: timeAgo, // 函数体是timeago
    // 反馈面板-"选项"选择事件
    onSelect (action) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        // 子向父传值
        this.$emit('dislike', this.artObj)
        this.show = false // 关闭弹窗
      } else { // 这里就是二级反馈
        this.$emit('report', this.artObj, action.value) // 外面需要反馈类型的值
        this.actions = firstActions
        this.show = false
      }
    },
    // 反馈面板-底部按钮-点击事件
    cancelFn () {
      if (this.bottomText === '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 反馈面板-关闭面板-触发事件
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  },
  data () {
    return {
      show: false, // 折叠面板显示或隐藏
      actions: firstActions,
      bottomText: '取消'
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span{
    margin: 0 3px;
    &:first-child{
        margin-left: 0;
    }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
