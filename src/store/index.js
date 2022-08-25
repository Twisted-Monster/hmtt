import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto:
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.xSFyw3F-oRk2_fJadRwx-AAAAA?w=210&h=210&c=7&r=0&o=5&dpr=1.25&pid=1.7' // 头像
  },
  getters: {},
  mutations: {
    SET_USERPHOTO(state, value) {
      state.userPhoto = value
    }
  },
  actions: {},
  modules: {}
})
