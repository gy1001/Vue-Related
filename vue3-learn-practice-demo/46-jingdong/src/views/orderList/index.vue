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
import TabBar from '@/components/TabBar.vue'
export default {
  components: {
    TabBar
  },
  name: 'order-list',
  setup() {
    return {
      isCanceled: false,
      list: [
        {
          shopName: '沃尔玛',
          totalNumber: 22,
          totalPrice: 200,
          products: [
            {
              product: { name: '商品', img: '' }
            },
            {
              product: { name: '商品222', img: '' }
            }
          ]
        }
      ]
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
