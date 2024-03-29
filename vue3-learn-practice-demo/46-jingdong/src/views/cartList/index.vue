<template>
  <div class="wrapper">
    <div class="title">我的购物车</div>
    <div class="shops">
      <div class="empty">购物车当前为空</div>
      <div
        class="shop"
        v-for="(item, index) in cartListWithProducts"
        :key="index"
        @click="handleGoToPay(index)"
      >
        <div class="shop-title">{{ item.shopName }}</div>
        <div class="products">
          <div class="products-list">
            <template v-for="product in item.productList" :key="product._id">
              <div v-if="product.count > 0" class="products-item">
                <img class="products-item-img" :src="product.imgUrl" />
                <div class="products-item-detail">
                  <h4 class="products-item-title">
                    {{ product.name }}
                  </h4>
                  <p class="products-item-price">
                    <span>
                      <span class="products-item-yen">&yen; </span>
                      {{ product.price }} x
                      {{ product.count }}
                    </span>
                    <span class="products-item-total">
                      <span class="products-item-yen">&yen; </span>
                      {{ (product.price * product.count).toFixed(2) }}
                    </span>
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TabBar :currentIndex="1" />
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { useRouter } from 'vue-router'

const useCartEffect = () => {
  const store = useStore()
  const cartList = store.state.cartList
  const cartListWithProducts = computed(() => {
    const newCartList = {}
    for (const shopIdKey in cartList) {
      let total = 0
      const products = cartList[shopIdKey].productList
      for (const productIdKey in products) {
        const product = products[productIdKey]
        total += product.count || 0
      }
      if (total > 0) {
        newCartList[shopIdKey] = cartList[shopIdKey]
      }
    }
    return newCartList
  })
  return {
    cartListWithProducts
  }
}
// 处理去结算逻辑
const useGoToPayEffect = () => {
  const router = useRouter()
  const handleGoToPay = shopId => {
    router.push({
      path: `/orderConfirmation/${shopId}`
    })
  }
  return { handleGoToPay }
}
export default {
  components: {
    TabBar
  },
  name: 'cart-list',
  setup() {
    const { cartListWithProducts } = useCartEffect()
    const { handleGoToPay } = useGoToPayEffect()
    return {
      handleGoToPay,
      cartListWithProducts: cartListWithProducts
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/variable.scss';
@import '@/style/mixins';
.wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0.49rem;
  right: 0;
  background: $dark-bgColor;
}
.title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  line-height: 0.44rem;
  background: $bgColor;
  font-size: 0.16rem;
  color: $content-fontColor;
  text-align: center;
}
.shops {
  overflow-y: scroll;
  position: absolute;
  top: 0.4rem;
  right: 0.18rem;
  bottom: 0.01rem;
  left: 0.18rem;
  .empty {
    line-height: 0.44rem;
    color: $light-fontColor;
    font-size: 0.16rem;
    text-align: center;
  }
}
.shop {
  position: relative;
  margin-top: 0.16rem;
  border-radius: 0.16rem;
  background: $bgColor;
  &-title {
    padding: 0.16rem;
    font-size: 0.16rem;
    color: $content-fontColor;
  }
  &-wrapper {
    // overflow-y: scroll;
    margin: 0 0.18rem;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.06rem;
    top: 2.6rem;
  }
}
.products {
  &-list {
    background: $bgColor;
  }
  &-item {
    position: relative;
    display: flex;
    margin-top: 0.16rem;
    padding: 0 0.16rem 0.16rem 0.16rem;
    &-img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &-detail {
      flex: 1;
    }
    &-title {
      margin: 0;
      line-height: 0.24rem;
      font-size: 0.14rem;
      color: $content-fontColor;
      @include ellipse;
    }
    &-price {
      display: flex;
      margin-top: 0.18rem;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $hightlight-fontColor;
    }
    &-total {
      flex: 1;
      text-align: right;
      color: $darkColor;
    }
    &-yen {
      font-size: 0.12rem;
    }
  }
}
</style>
