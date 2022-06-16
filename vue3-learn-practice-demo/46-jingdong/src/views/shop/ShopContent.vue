<template>
  <!-- 主体内容区 -->
  <div class="content">
    <!-- 侧边导航 -->
    <div class="sidebar">
      <div
        v-for="item in tabList"
        :class="{
          'sidebar-item': true,
          'sidebar-item-active': currentTab === item.tab
        }"
        :key="item.id"
        @click="() => handleTabClick(item.tab)"
      >
        {{ item.name }}
      </div>
    </div>
    <!-- 商品列表-->
    <div class="product">
      <div class="product-item" v-for="item in goodsList" :key="item.id">
        <img class="product-item-img" :src="item.imgUrl" />
        <div class="product-details">
          <h3 class="product-details-name">{{ item.name }}</h3>
          <p class="product-details-sales">月售{{ item.sales }}</p>
          <div class="product-details-price">
            <p class="product-details-price-now">
              <span>&yen;</span>{{ item.price }}
            </p>
            <span class="product-details-price-old">
              &yen;{{ item.oldPrice }}
            </span>
          </div>
        </div>
        <div class="product-count">
          <span class="product-count-mius iconfont"> &#xe60b; </span>
          <!-- 显示的是购物车的商品数量 -->
          <span class="product-count-number">2 </span>
          <span class="product-count-plus iconfont"> &#xe61e; </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
// tab列表
const tabList = [
  { id: 1, name: '全部商品', tab: 'all' },
  { id: 2, name: '秒杀', tab: 'seckill' },
  { id: 3, name: '新鲜水果', tab: 'fruit' }
]
// tab切换逻辑
const useTagEffect = () => {
  const currentTab = ref(tabList[0].tab)
  const handleTabClick = tab => {
    currentTab.value = tab
  }
  return { currentTab, handleTabClick }
}

export default {
  name: 'shop-content',
  setup() {
    const { currentTab, handleTabClick } = useTagEffect()
    return {
      tabList,
      currentTab,
      handleTabClick,
      goodsList: [
        {
          id: '1',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        },
        {
          id: '2',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        },
        {
          id: '3',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        },
        {
          id: '4',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        },
        {
          id: '5',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        },
        {
          id: '6',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        },
        {
          id: '7',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        },
        {
          id: '8',
          imgUrl: 'http://www.dell-lee.com/imgs/vue3/near.png',
          name: '名字',
          sales: '12002',
          price: '1000',
          oldPrice: 200
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/variable.scss';
.content {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 154px;
  bottom: 49px;
  //左侧导航栏
  .sidebar {
    border-radius: 2px;
    border-radius: 2px;
    width: 76px;
    margin-top: 16px;
    overflow-y: scroll;
    background: $search-bgColor;
    &-item {
      font-size: 14px;
      color: $content-fontColor;
      text-align: center;
      line-height: 50px;
      &-active {
        background: #fff;
      }
    }
  }
  //商品信息
  .product {
    flex: 1;
    margin: 0 10px 0 16px;
    overflow-y: scroll;
    &-item {
      position: relative;
      display: flex;
      align-items: center;
      padding-bottom: 18px;
      border-bottom: 1px solid #f1f1f1;
      margin: 12px 0;
      &-img {
        width: 68px;
        height: 68px;
        margin-right: 16px;
      }
    }
    &-details {
      color: $content-fontColor;
      &-name {
        font-weight: 550;
        font-size: 14px;
      }
      &-sales {
        font-size: 12px;
        margin: 6px 0;
      }
      &-price-now {
        display: inline-block;
        margin-right: 6px;
        color: #e93b3b;
        font-weight: bold;
        font-size: 14px;
        line-height: 14px;
        span {
          font-size: 10px;
        }
      }
      &-price-old {
        display: inline-block;
        text-decoration: line-through;
        color: #999999;
        font-size: 10px;
        line-height: 20px;
      }
    }
    &-count {
      position: absolute;
      bottom: 0;
      right: 0;
      margin-bottom: 18px;
      &-mius,
      &-plus {
        display: inline-block;
        font-size: 14px;
        text-align: center;
        border-radius: 50%;
      }
      &-mius {
        box-sizing: border-box;
        width: 18px;
        height: 18px;
        color: #666666;
        border: 1px solid #666666;
      }
      &-plus {
        width: 20px;
        height: 20px;
        line-height: 20px;
        background-color: #0091ff;
        color: #fff;
      }
      &-number {
        margin: 0 10px;
        color: $content-fontColor;
      }
    }
  }
}
</style>
