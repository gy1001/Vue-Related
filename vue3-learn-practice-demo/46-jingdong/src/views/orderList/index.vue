<template>
  <div class="wraper">
    <div class="order">
      <div class="title">我的订单</div>
      <div class="order-list">
        <div
          class="order-list-item"
          v-for="(item, index) in list"
          :key="index + item.shopName"
        >
          <div class="order-title">
            {{ item.shopName }}
            <span class="order-title-status">
              {{ isCanceled ? '已取消' : '已下单' }}
            </span>
          </div>
          <div class="order-content">
            <template
              v-for="(innerItem, innerIndex) in item.products"
              :key="innerIndex + innerItem.product.name"
            >
              <img
                class="order-content-img"
                :src="innerItem.product.img"
                v-if="innerIndex <= 4"
              />
            </template>
            <div class="order-content-info">
              <div class="order-content-price">
                &yen;{{ item.totalPrice.toFixed(1) }}
              </div>
              <div class="order-content-count">共{{ item.totalNumber }}件</div>
            </div>
          </div>
        </div>
      </div>
      <TabBar :currentIndex="2" />
    </div>
  </div>
</template>

<script>
import { toRefs, reactive } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { get } from '../../utils/requests'

const useOrderListEffect = () => {
  const data = reactive({ list: [] })
  const getNearShopList = async () => {
    const result = await get('/api/order')
    if (result.errno === 0 && result?.data?.length) {
      const orderList = result.data
      orderList.forEach(order => {
        const products = order.products || []
        let totalNumber = 0
        let totalPrice = 0
        // 遍历计算总价和总和
        products.forEach(productItem => {
          totalNumber += productItem?.orderSales || 0
          totalPrice +=
            productItem?.product?.price * productItem?.orderSales || 0
        })
        order.totalNumber = totalNumber
        order.totalPrice = totalPrice
      })
      data.list = result.data
    }
  }
  getNearShopList()
  const { list } = toRefs(data)
  console.log(list)
  return { list }
}

export default {
  components: {
    TabBar
  },
  name: 'order-list',
  setup() {
    const { list } = useOrderListEffect()
    return {
      isCanceled: false,
      list: list
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/variable.scss';
.warper {
  padding: 0;
  margin: 0;
}
.order {
  .title {
    text-align: center;
    font-size: 0.16rem;
    line-height: 0.22rem;
    padding: 0.11rem 0;
    color: $content-fontColor;
    background-color: $bgColor;
  }
  &-list {
    position: absolute;
    top: 0.6rem;
    left: 0;
    right: 0;
    bottom: 0.49rem;
    &-item {
      box-shadow: 0 0.01rem 0.01rem 0.01rem rgba($color: #000000, $alpha: 0.2);
      margin: 0.16rem 0.18rem;
      padding: 0.16rem;
    }
  }
  &-title {
    display: flex;
    justify-content: space-between;
    font-size: 0.16rem;
    color: $content-fontColor;
    &-status {
      font-size: 0.14rem;
      color: $light-fontColor;
    }
  }
  &-content {
    position: relative;
    display: flex;
    margin-top: 0.16rem;
    &-img {
      margin-right: 0.12rem;
      width: 0.4rem;
      height: 0.4rem;
    }
    &-info {
      position: absolute;
      right: 0;
      bottom: 0;
      text-align: right;
    }
    &-price {
      margin-bottom: 0.04rem;
      font-size: 0.14rem;
      color: $hightlight-fontColor;
    }
    &-count {
      font-size: 0.12rem;
      color: $content-fontColor;
    }
  }
}
</style>
