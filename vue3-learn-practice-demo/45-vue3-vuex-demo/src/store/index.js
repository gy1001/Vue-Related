import { createStore } from 'vuex'
// VUex 数据管理框架
// Vuex  创建了一个全局唯一的仓库，用来存放全局的数据
export default createStore({
  state: {
    name: '孙悟空',
  },
  getters: {},
  // 建议：mutations 只能写同步代码，不允许写异代码
  // commit 和 mutation 做关联
  mutations: {
    // 第四步：对应的 mutation 会被执行
    change(state, payload) {
      // 第五步： 在此处修改数据
      console.log(state, payload)
      state.name = payload
    },
  },
  // dispatch 和 actions 做关联
  actions: {
    // 第二步：store 感知到你触发了一个叫做 change 的 action, 执行 change 方法
    change(context, payload) {
      console.log(1221)
      // 第三步，提交一个 commit 触发一个 mutation
      this.commit('change', payload)
    },
  },
  modules: {},
})
