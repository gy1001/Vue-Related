<template>
  <div class="content">
    <div class="inventory">
      <h3 class="inventory-title">{{ shopName }}</h3>
      <div class="inventory-list">
        <template v-for="item in showProductList" :key="item._id">
          <div class="inventory-item">
            <img class="inventory-item-image" :src="item.imgUrl" />
            <h4 class="inventory-item-title">{{ item.name }}</h4>

            <div class="inventory-item-count">
              <span class="inventory-item-yen">&yen;</span>
              {{ item.price }}×{{ item.count }}
            </div>

            <div class="inventory-item-total">
              <span class="inventory-item-yen"> &yen;</span>
              {{ (item.price * item.count).toFixed(1) }}
            </div>
          </div>
        </template>
      </div>
      <div
        class="inventory-weight iconfont"
        @click="showAllProduct = !showAllProduct"
      >
        共计{{ calculations.count }}件/{{ calculations.count * 0.25 }}kg
        <span
          class="inventory-weight-icon iconfont"
          v-html="showAllProduct ? '&#xe604;' : '&#xe919;'"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useCartEffect } from '@/effects/CartEffect'
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'

// 处理列表展示内容相关逻辑
const useShowProductListEffect = (showAllProduct, productList) => {
  const showProductList = computed(() => {
    const list = []
    let count = 0
    if (!showAllProduct.value) {
      // 默认2个
      for (const item in productList.value) {
        if (
          productList.value[item].count &&
          productList.value[item].checked &&
          count < 2
        ) {
          count++
          list.push(productList.value[item])
        }
      }
    } else {
      // 显示所有
      for (const item in productList.value) {
        if (productList.value[item].count && productList.value[item].checked) {
          list.push(productList.value[item])
        }
      }
    }
    return list
  })
  return {
    showProductList
  }
}
export default {
  name: 'product-list',
  setup() {
    const route = useRoute()
    const showAllProduct = ref(false)
    const shopId = route.params.id
    const { calculations, shopName, productList } = useCartEffect(shopId)
    const { showProductList } = useShowProductListEffect(
      showAllProduct,
      productList
    )
    return {
      showProductList,
      calculations,
      shopName,
      showAllProduct
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixins.scss';
@import '@/style/variable.scss';
.inventory {
  position: relative;
  padding: 0.16rem;
  margin: 0 0.18rem 0.65rem 0.18rem;
  background-color: $bgColor;
  box-shadow: 0rem 0.01rem 0.03rem 0.01rem rgba($color: #000000, $alpha: 0.1);
  &-title {
    margin-bottom: 0.16rem;
    font-size: 0.16rem;
    color: $content-fontColor;
  }
  &-list {
    overflow-y: scroll;
  }
  &-item {
    position: relative;
    display: flex;
    margin-bottom: 0.16rem;
    font-size: 0.14rem;
    color: $content-fontColor;
    &-image {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &-title {
      font-size: 0.16rem;
      @include ellipse;
    }
    &-count {
      position: absolute;
      left: 0.62rem;
      bottom: 0;
      color: $hightlight-fontColor;
    }
    &-total {
      position: absolute;
      bottom: 0;
      right: 0.16rem;
    }
    &-yen {
      font-size: 0.1rem;
    }
  }
  &-weight {
    height: 0.28rem;
    font-size: 0.14rem;
    font-weight: 200;
    text-align: center;
    line-height: 0.28rem;
    color: #999;
    background-color: $search-bgColor;
    &-icon {
      margin-left: 0.08rem;
    }
  }
}
</style>
