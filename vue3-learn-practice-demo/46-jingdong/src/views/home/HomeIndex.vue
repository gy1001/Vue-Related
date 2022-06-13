<template>
  <div class="wrapper">
    <HomeHeader />
    <BannerItem />
    <div class="icons">
      <div class="icons__item" v-for="item in navList" :key="item.desc">
        <img
          :src="`http://www.dell-lee.com/imgs/vue3/${item.imgName}.png`"
          alt=""
          class="icons__item-icon"
        />
        <p class="icons__item-desc">{{ item.desc }}</p>
      </div>
    </div>
    <div class="border-line"></div>
    <NearShop />
  </div>
  <TabBar />
</template>

<script>
import { defineComponent, reactive } from 'vue'
import TabBar from '@/components/TabBar.vue'
import BannerItem from './BannerItem.vue'
import HomeHeader from './HomeHeader.vue'
import NearShop from './NearShop.vue'

export default defineComponent({
  components: {
    TabBar: TabBar,
    BannerItem: BannerItem,
    HomeHeader: HomeHeader,
    NearShop: NearShop
  },
  setup() {
    const navList = reactive([
      { imgName: '超市', desc: '超市便利' },
      { imgName: '菜市场', desc: '菜市场' },
      { imgName: '水果店', desc: '水果店' },
      { imgName: '鲜花', desc: '鲜花绿植' },
      { imgName: '医药健康', desc: '医药健康' },
      { imgName: '家居', desc: '家居时尚' },
      { imgName: '蛋糕', desc: '烘培蛋糕' },
      { imgName: '签到', desc: '签到' },
      { imgName: '大牌免运', desc: '大牌免运' },
      { imgName: '红包', desc: '红包套餐' }
    ])
    return { navList }
  }
})
</script>

<style lang="scss" scoped>
@import '../../style/variable.scss';
.wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0.49rem;
  right: 0;
  padding: 0 0.18rem;
}
.icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 0.16rem;
  color: $content-fontColor;
  &__item {
    width: 20%;
    &-icon {
      display: block;
      width: 0.4rem;
      height: 0.4rem;
      margin: 0 auto;
    }
    &-desc {
      text-align: center;
      margin: 0.06rem 0 0.16rem 0;
      font-size: 0.12rem;
    }
  }
}
.border-line {
  margin: 0 -0.18rem;
  height: 0.1rem;
  background: $content-bgColor;
}
</style>
