<template>
  <div class="warper">
    <div class="bottom">
      <div class="bottom-pay">
        实付金额
        <span class="bottom-pay-price">
          <b> &yen;{{ calculations.price }}</b>
        </span>
      </div>
      <div class="bottom-confirmation" @click="handleShowConfirmChange">
        提交订单
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="popups" v-if="showConfirm">
      <!-- 支付成功提醒 -->
      <!-- <div class="popups-msg" v-if="showMessage">
                <p class="popups-msg-close iconfont">&#xe602;</p>
                <p class="popups-msg-yes iconfont">&#xe620;</p>
                <p class="popups-msg-message">支付成功，等待配送</p>
            </div> -->
      <!-- 二次确认订单弹窗 -->
      <div class="popups-pay" v-if="showConfirm">
        <h3 class="popups-pay-title">确认要离开收银台？</h3>
        <p class="popups-pay-message">请尽快完成支付，否则将被取消</p>
        <div class="popups-pay-btn">
          <div class="popups-pay-cancel" @click="handleConfirmOrder(true)">
            取消订单
          </div>
          <div class="popups-pay-confirm" @click="handleConfirmOrder(false)">
            确认支付
          </div>
        </div>
      </div>
    </div>
    <!-- 背景遮挡层 -->
    <div
      class="popups-bg"
      v-if="showConfirm"
      @click="handleShowConfirmChange"
    ></div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useCartEffect } from '../../effects/CartEffect'

// 下单相关逻辑
const useMakeOrderEffect = () => {
  const handleConfirmOrder = isCanceled => {
    console.log('isCanceled', isCanceled)
  }
  return {
    handleConfirmOrder
  }
}

// 弹遮层显示相关逻辑
const useShowMaskEffect = () => {
  const showConfirm = ref(false)
  const handleShowConfirmChange = () => {
    showConfirm.value = !showConfirm.value
  }
  return { showConfirm, handleShowConfirmChange }
}

export default {
  name: 'order-confirm',
  setup() {
    const route = useRoute()
    const shopId = route.params.id
    const { calculations } = useCartEffect(shopId)
    const { showConfirm, handleShowConfirmChange } = useShowMaskEffect()
    const { handleConfirmOrder } = useMakeOrderEffect()
    return {
      handleConfirmOrder,
      handleShowConfirmChange,
      calculations,
      showConfirm
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/variable.scss';
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  line-height: 0.49rem;
  font-size: 0.14rem;
  background: #fff;
  box-shadow: 0 -0.01rem 0.01rem 0 $content-bgColor;
  &-pay {
    margin-left: 0.24rem;
    color: $content-fontColor;
    &-price {
      margin-left: 0.02rem;
      font-size: 0.16rem;
      font-weight: 500;
      color: #151515;
    }
  }
  &-confirmation {
    width: 0.98rem;
    text-align: center;
    color: #fff;
    background-color: #4fb0f9;
  }
}
.popups {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3.01rem;
  height: 1.56rem;
  text-align: center;
  border-radius: 0.04rem;
  background: #fff;
  z-index: 10;
  &-msg {
    &-close {
      position: absolute;
      right: 0;
      top: 0;
      margin: 0.12rem 0.12rem 0 0;
      z-index: 2;
    }
    &-yes {
      margin-top: 0.4rem;
      font-size: 0.4rem;
    }
    &-message {
      font-size: 0.18rem;
      margin-top: 0.24rem;
      color: $content-fontColor;
    }
  }
  &-pay {
    &-title {
      margin-top: 0.24rem;
      font-size: 0.18rem;
      color: $content-fontColor;
    }
    &-message {
      margin-top: 0.08rem;
      font-size: 0.14rem;
      color: #666;
    }
    &-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.24rem 0;
      font-size: 0.14rem;
    }
    &-cancel,
    &-confirm {
      margin: 0 0.12rem;
      width: 0.8rem;
      height: 0.32rem;
      line-height: 0.32rem;
      border-radius: 0.16rem;
      border: 0.01rem solid #4fb0f9;
      box-sizing: content-box;
    }
    &-cancel {
      color: $btn-bgColor;
    }
    &-confirm {
      color: $bgColor;
      background: #4fb0f9;
    }
  }
}
.popups-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}
</style>
