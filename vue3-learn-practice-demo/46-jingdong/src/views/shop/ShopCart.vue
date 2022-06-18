<template>
  <div class="shopcart">
    <div class="warper" v-if="isShow" @click="showShopCart"></div>
    <div class="product" v-if="isShow">
      <div class="product-header">
        <div class="product-header-checked">
          <span
            class="product-header-icon iconfont"
            v-html="calculations.isCheckedAll ? '&#xe77b;' : '&#xe670;'"
            @click="changeCartProductsChecked(calculations.isCheckedAll)"
          ></span>
          全选
        </div>
        <div class="product-header-Empty" @click="clearCartProducts">
          清空购物车
        </div>
      </div>
      <!-- 商品列表-->
      <template v-for="item in productList" :key="item.id">
        <div class="product-item" v-if="item.count">
          <div
            class="product-item-checked iconfont"
            v-html="item.checked ? '&#xe77b;' : '&#xe670;'"
            @click="changeCartItemChecked(item._id)"
          ></div>
          <img class="product-item-img" :src="item.imgUrl" />
          <div class="product-details">
            <h3 class="product-details-name">
              {{ item.name }}
            </h3>
            <div class="product-price">
              <p class="product-price-now">
                <span>&yen;</span>{{ item.price }}
              </p>
              <span class="product-price-old"> &yen;{{ item.oldPrice }} </span>
            </div>
          </div>
          <div class="product-count">
            <span class="product-count-mius iconfont"> &#xe60b; </span>
            <span class="product-count-number">
              {{ item.count }}
            </span>
            <span class="product-count-plus iconfont"> &#xe61e; </span>
          </div>
        </div>
      </template>
    </div>
    <div class="check">
      <div class="check-cart" @click="showShopCart">
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
    <Toast v-if="isShowToast" :message="toastMessage" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useCartEffect } from '../../effects/CartEffect'
import Toast, { useToastEffect } from '../../components/showToast.vue'

const useShopCartInfoEffect = () => {
  const store = useStore()
  // 清空购物车
  const clearCartProducts = shopId => {
    store.commit('clearCartProducts', { shopId })
  }
  const changeCartProductsChecked = (shopId, isCheckedAll) => {
    store.commit('changeCartProductsChecked', {
      shopId,
      isCheckedAll: !isCheckedAll
    })
  }
  return {
    clearCartProducts,
    changeCartProductsChecked
  }
}

export default {
  name: 'shop-cart',
  components: {
    Toast
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const shopId = route.params.id
    const isShow = ref(false)
    const { showToast, toastMessage, isShowToast } = useToastEffect()
    const handleSettlement = order => {
      console.log(order)
      if (!order) {
        showToast('你还没选择宝贝哦！')
      } else {
        console.log(12221)
        router.push({ path: `/orderConfirmation/${shopId}` })
      }
    }
    const { calculations, productList } = useCartEffect(shopId)
    const showShopCart = () => {
      isShow.value = !isShow.value
    }
    // 商品选中
    const changeCartItemChecked = productId => {
      // 提交changeCartItemChecked事件 可以同步修改store的数据
      store.commit('changeCartItemChecked', { shopId, productId })
    }
    const { clearCartProducts, changeCartProductsChecked } =
      useShopCartInfoEffect()
    return {
      handleSettlement,
      showShopCart,
      calculations,
      isShow,
      productList,
      toastMessage,
      isShowToast,
      changeCartItemChecked,
      changeCartProductsChecked: $event =>
        changeCartProductsChecked(shopId, $event),
      clearCartProducts: () => clearCartProducts(shopId)
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
.product {
  overflow-y: scroll;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin-bottom: 0.49rem;
  width: 100%;
  background: $bgColor;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.16rem 0.18rem;
    margin-bottom: 0.16rem;
    font-size: 0.14rem;
    line-height: 0.2rem;
    color: $content-fontColor;
    border-bottom: 0.01rem solid $content-bgColor;
    vertical-align: top;
    &-icon {
      font-size: 0.2rem;
      color: $btn-bgColor;
      margin-right: 0.08rem;
    }
  }
  &-item {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 0.18rem 0.16rem;
    &-checked {
      font-size: 0.2rem;
      color: $btn-bgColor;
    }
    &-img {
      width: 0.46rem;
      height: 0.46rem;
      margin: 0 0.16rem;
    }
  }
  &-details {
    color: $content-fontColor;
    &-name {
      font-weight: 550;
      font-size: 0.14rem;
      margin: 0;
    }
  }
  &-price {
    margin-top: 0.06rem;
    &-now {
      display: inline-block;
      color: $hightlight-fontColor;
      font-weight: bold;
      font-size: 0.14rem;
      line-height: 0.14rem;
      span {
        font-size: 0.1rem;
      }
    }
    &-old {
      display: inline-block;
      text-decoration: line-through;
      color: $light-fontColor;
      font-size: 0.1rem;
      line-height: 0.2rem;
    }
  }
  &-count {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 0.18rem;
    &-mius,
    &-plus {
      display: inline-block;
      font-size: 0.14rem;
      text-align: center;
      border-radius: 50%;
    }
    &-mius {
      box-sizing: border-box;
      width: 0.18rem;
      height: 0.18rem;
      color: $medium-fontColor;
      border: 0.01rem solid $medium-fontColor;
    }
    &-plus {
      width: 0.2rem;
      height: 0.2rem;
      line-height: 0.2rem;
      background-color: $btn-bgColor;
      color: $bgColor;
    }
    &-number {
      margin: 0 0.1rem;
      color: $content-fontColor;
    }
  }
}
</style>
