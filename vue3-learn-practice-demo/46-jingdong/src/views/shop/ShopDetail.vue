<template>
  <div class="shop">
    <!-- 头部搜索框 -->
    <div class="header">
      <div class="header-back" @click="handleBackClick">
        <span class="header-back-icon iconfont">&#xe677;</span>
      </div>
      <div class="header-search">
        <span class="header-search-icon iconfont">&#xe60c;</span>
        <input type="search" placeholder="请输入商品名称搜索" />
      </div>
    </div>
    <div class="shop-info">
      <ShopInfo :item="item" :hideBorder="true" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ShopInfo from '@/components/ShopInfo.vue'
export default {
  name: 'shop-detail',
  components: {
    ShopInfo
  },
  setup() {
    const router = useRouter()
    const handleBackClick = () => {
      router.back()
    }
    const item = ref({ name: '店铺名' })
    return {
      item,
      handleBackClick
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/variable.scss';
// 头部样式
.header {
  margin: 16px 18px;
  display: flex;
  align-items: center;
  &-back {
    margin-right: 16px;
    &-icon {
      font-size: 22px;
    }
  }
  &-search {
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    border-radius: 16px;
    background: $search-bgColor;
    &-icon {
      font-size: 16px;
      padding: 8px 12px 8px 16px;
      text-align: center;
    }
    input {
      width: 100%;
      height: 32px;
      border-radius: 16px;
      font-size: 14px;
      outline: none;
      border: 0;
      background: $search-bgColor;
    }
  }
}
// 商家信息
.shop-info {
  margin: 0 18px;
}
</style>
