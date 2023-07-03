<script setup lang="ts">
import { ref } from 'vue'
const count = ref(100)
</script>

<template>
  <div @click="count++">
    {{ count }}
  </div>
</template>

<style scoped></style>
