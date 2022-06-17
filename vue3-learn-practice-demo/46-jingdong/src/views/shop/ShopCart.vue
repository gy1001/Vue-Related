<template>
  <div class="shopcart">
    <div class="check">
      <div class="check-cart" @click="showShopCart()">
        <span class="check-cart-icon iconfont">&#xe605;</span>
        <div class="check-cart-count" v-if="calculations.count">
          {{ calculations.count }}
        </div>
      </div>
      <div class="check-total" v-if="!calculations.cartStatus">
        总计：
        <span class="check-total-price"> ￥{{ calculations.price }} </span>
      </div>
      <div class="check-total" v-if="calculations.cartStatus">购物车是空的</div>
      <div class="check-btn" @click="handleSettlement(calculations.count)">
        去结算
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useCartEffect } from '../../effects/CartEffect'
export default {
  name: 'shop-cart',
  setup() {
    const route = useRoute()
    const shopId = route.params.id
    const handleSettlement = () => {}
    const showShopCart = () => {}
    const { calculations } = useCartEffect(shopId)
    return {
      handleSettlement,
      showShopCart,
      calculations
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/variable.scss';

.warper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);
}
.check {
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 0.49rem;
  line-height: 0.49rem;
  background: $bgColor;
  // box-shadow: 0 -0.01rem 0.01rem 0 $content-bgColor;
  box-sizing: border-box;
  &-cart {
    position: relative;
    margin: 0 0.24rem;
    &-icon {
      color: $btn-bgColor;
      font-size: 0.2rem;
      display: block;
    }
    &-count {
      position: absolute;
      top: 0.05rem;
      right: -0.1rem;
      font-size: 0.05rem;
      line-height: 0.08rem;
      min-width: 0.1rem;
      height: 0.1rem;
      text-align: center;
      border-radius: 8rem;
      color: $bgColor;
      background: $hightlight-fontColor;
      transform-origin: left;
    }
  }
  &-total {
    flex: 1;
    margin-left: 0.16rem;
    font-size: 0.12rem;
    color: $content-fontColor;
    &-price {
      font-weight: 550;
      font-size: 0.18rem;
      color: $hightlight-fontColor;
    }
  }
  &-btn {
    text-align: center;
    width: 0.98rem;
    background: $btn-bgColor;
    font-size: 0.14rem;
    line-height: 0.49rem;
    color: $bgColor;
  }
}
</style>
