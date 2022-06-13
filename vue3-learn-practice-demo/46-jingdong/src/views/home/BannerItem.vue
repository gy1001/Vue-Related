<template>
  <div class="banner">
    <img
      class="banner__img"
      src="http://www.dell-lee.com/imgs/vue3/banner.jpg"
    />
  </div>
</template>

<script>
export default {
  name: 'banner-item'
}
</script>

<style scoped lang="scss">
.banner {
  margin-top: 0.12rem;
  height: 0;
  overflow: hidden;
  padding-bottom: 25.4%; // 放置图片加载过程导致的页面抖动
  &__img {
    width: 100%;
    border-bottom: 25%;
  }
}
</style>
