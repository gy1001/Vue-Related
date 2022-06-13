<template>
  <div class="position">
    <span class="position__icon iconfont">&#xe636;</span>
    山西理工大学国防科技园2号楼10层 北京北京北京北京北京北京
    <span class="position__notice iconfont">&#xe63d;</span>
  </div>
  <div class="searchbar">
    <div class="searchbar-icon">
      <span class="iconfont">&#xe60c;</span>
    </div>
    <input type="search" placeholder="山姆会员商店优惠商品" />
  </div>
</template>

<script>
export default {
  name: 'home-header'
}
</script>

<style lang="scss" scoped>
@import '../../style/mixins.scss';
@import '../../style/variable.scss';

.position {
  @include ellipse;
  padding: 0.16rem 0;
  line-height: 0.22rem;
  font-size: 0.16rem;
  position: relative;
  padding-right: 0.24rem;
  color: $content-fontColor;
  &__icon {
    top: 1rem;
    margin-right: 0.08rem;
  }
  &__notice {
    position: absolute;
    font-size: 0.2rem;
    top: 0.17rem;
    right: 0;
  }
}
.searchbar {
  display: flex;
  border-radius: 0.16rem;
  height: 0.32rem;
  background: rgba($color: #272727, $alpha: 0.1);
  color: #b7b7b7;
  overflow: hidden;
  input {
    width: 100%;
    height: 100%;
    font-size: 0.14rem;
    line-height: 0.16rem;
    border: 0rem;
    outline: none;
    background: rgba($color: #272727, $alpha: 0.05);
  }
  &-icon {
    line-height: 0.32rem;
    margin: 0rem 0.07rem;
  }
}
</style>
