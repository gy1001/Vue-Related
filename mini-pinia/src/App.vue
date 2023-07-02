<template>
  <div>{{ count }}:{{ countStore.count }}</div>
  <div>双倍：{{ countStore.doubleCount }}</div>
  <button @click="countStore.increment(3)">
    使用 pinia 调用 actions 增加 3
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UseCountStore } from './store/count'

const countStore = UseCountStore()
const count = ref(100)
</script>

<style scoped></style>
