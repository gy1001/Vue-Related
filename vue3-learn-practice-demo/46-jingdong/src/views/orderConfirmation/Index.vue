<template>
  <div class="warper">
    <TopArea></TopArea>
    <ProductList />
    <Confirmation />
  </div>
</template>

<script>
import TopArea from './TopArea.vue'
import ProductList from './ ProductList.vue'
import Confirmation from './Confirmation.vue'
export default {
  name: 'order-confirm',
  components: {
    TopArea,
    ProductList,
    Confirmation
  },
  setup() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>
