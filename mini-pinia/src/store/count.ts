import { defineStore } from 'pinia'

export const UseCountStore = defineStore('count', {
  state: () => {
    return {
      count: 100,
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
  },
  actions: {
    increment(number: number) {
      this.count = this.count + number
    },
  },
})
