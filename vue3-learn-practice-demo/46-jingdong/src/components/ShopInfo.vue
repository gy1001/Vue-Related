<template>
  <div class="warper">
    <div class="shop">
      <img class="shop-img" :src="item.imgUrl" />
      <div
        :class="{
          'shop-content': true,
          'shop-content-hide-border': hideBorder ? false : true
        }"
      >
        <p class="shop-content-title">{{ item.name }}</p>
        <span class="shop-content-desc"> 月售{{ item.sales }}+ </span>
        <span class="shop-content-desc"> 起送￥{{ item.expressLimit }}</span>
        <span class="shop-content-desc">
          基础运费￥{{ item.expressPrice }}
        </span>
        <p class="shop-content-pref">
          {{ item.slogan }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopInfo',
  props: { item: Object, hideBorder: Boolean }
}
</script>

<style lang="scss" scoped>
@import '../style/variable.scss';
.shop {
  display: flex;
  color: $content-fontColor;
  margin-top: 0.12rem;
  &-img {
    margin-right: 0.16rem;
    width: 0.56rem;
    height: 0.56rem;
  }
  &-content {
    width: 100%;
    &-hide-border {
      border-bottom: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
    }
    &-title {
      font-size: 0.16rem;
      margin: 0 0 0.08rem 0;
    }
    &-desc {
      font-size: 0.13rem;
      margin: 0 0.16rem 0.08rem 0;
    }
    &-pref {
      font-size: 0.13rem;
      color: $hightlight-fontColor;
      margin-bottom: 0.12rem;
    }
  }
}
</style>
