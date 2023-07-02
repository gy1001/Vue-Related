// import { defineStore } from 'pinia'
import { defineStore } from '../my-pinia'

export const UseCountStore = defineStore('count', {
  state: () => {
    return {
      count: 100,
    }
  },
  getters: {
    doubleCount(state: any) {
      return state.count * 2
    },
  },
  actions: {
    increment(this: any, number: number) {
      this.count = this.count + number
    },
  },
})
