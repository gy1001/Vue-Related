<template>
  <div>
    <input v-model="inputValue" placeholder="请输入内容" />
    <button class="btn" @click="handleAddItem">提交</button>
  </div>
  <ul>
    <list-item v-for="item in list" :key="item"> {{ item }} </list-item>
  </ul>
</template>

<script>
import { reactive, ref } from 'vue'
import ListItem from './components/ListItem'
export default {
  name: 'App',
  components: {
    ListItem,
  },
  setup() {
    const inputValue = ref('')
    const list = reactive([1, 2, 3, 4, 5, 6, 7])
    const handleAddItem = () => {
      list.push(inputValue.value)
      inputValue.value = ''
    }
    return {
      list,
      inputValue,
      handleAddItem,
    }
  },
}
</script>

<style scoped>
.btn {
  margin-left: 20px;
  color: red;
}
</style>
