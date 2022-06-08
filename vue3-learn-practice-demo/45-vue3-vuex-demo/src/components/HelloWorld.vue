<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    {{ myName }}
    <button @click="handleClick">点击更改</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },

  setup() {
    const store = useStore()
    const myName = computed(() => {
      return store.state.name
    })
    axios.get('')
    const handleClick = () => {
      // 想改变数据，vuex要求第一步，必须派发一个action
      store.dispatch('change', '齐天大圣') // 这里如果不涉及到 异步操作，了可以直接进行 this.$store.commit("change")
    }
    return {
      myName,
      handleClick,
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
