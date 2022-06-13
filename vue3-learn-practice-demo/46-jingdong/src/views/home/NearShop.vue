<template>
  <div class="near-shop">
    <div class="shop-list">
      <div class="shop-list-title">附件店铺</div>
      <router-link
        v-for="item in nearShopList"
        :to="`/shop/${item._id}`"
        :key="item._id"
      >
        <ShopInfo :item="item"
      /></router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ShopInfo from '@/components/ShopInfo'
import { get } from '@/utils/requests'

// 处理获取附近店铺数据的逻辑
const useNearShopListEffect = () => {
  const nearShopList = ref([])
  const getNearShopList = async () => {
    const result = await get('/api/shop/hot-list')
    // const result = await get("/api/nearShopInfo")
    if (result?.errno === 0 && result?.data?.length) {
      console.log(nearShopList)
      nearShopList.value = result.data
    }
  }
  return { getNearShopList, nearShopList }
}
export default {
  name: 'near-shop',
  components: {
    ShopInfo: ShopInfo
  },
  setup() {
    const { getNearShopList, nearShopList } = useNearShopListEffect()
    getNearShopList()
    return { nearShopList }
  }
}
</script>

<style lang="scss" scoped>
.near-shop {
  .shop-list {
    margin-bottom: 49px;
    &-title {
      font-size: 18px;
      font-weight: bold;
      line-height: 25px;
      margin: 16px 0 2px 0;
    }
    a {
      text-decoration: none;
    }
  }
}
</style>
