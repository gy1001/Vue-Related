<template>
  <div class="wrapper">
    <div class="position">
      <span class="position__icon iconfont">&#xe636;</span>
      山西理工大学国防科技园2号楼10层 北京北京北京北京北京北京
      <span class="position__notice iconfont">&#xe63d;</span>
    </div>
  </div>
  <div class="docker">
    <!-- BEM 命名规则
      block_element Modifier
     -->
    <span class="docker_item docker_item--active">
      <i class="iconfont">&#xe752;</i>
      <div class="docker_item-title">首页</div>
    </span>
    <span class="docker_item">
      <i class="iconfont">&#xe64e;</i>
      <div class="docker_item-title">购物车</div>
    </span>
    <span class="docker_item">
      <i class="iconfont">&#xe600;</i>
      <div class="docker_item-title">订单</div>
    </span>
    <span class="docker_item">
      <i class="iconfont">&#xe63c;</i>
      <div class="docker_item-title">我的</div>
    </span>
  </div>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <!-- <router-view /> -->
</template>

<style lang="scss" scoped>
@import './style/variable.scss';
@import './style/mixins.scss';
.wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0.49rem;
  right: 0;
  padding: 0 0.18rem;
  .position {
    @include ellipse;
    padding: 0.16rem 0;
    line-height: 0.22rem;
    font-size: 0.16rem;
    position: relative;
    padding-right: 0.24rem;
    color: $content-font-color;
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
}
.docker {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.49rem;
  border-top: solid 0.01rem #f1f1f1;
  background-color: lightblue;
  text-align: center;
  display: flex;
  padding: 0 0.18rem;
  box-sizing: border-box;
  color: $content-font-color;
  &_item {
    &--active {
      color: #1fa4fc;
    }
    flex: 1;
    &-title {
      font-size: 0.2rem; // 低于12px 浏览器不会再处理，所以要进行特殊处理
      transform-origin: center top;
      transform: scale(0.5, 0.5);
    }
    .iconfont {
      font-size: 0.18rem;
      margin-top: 0.07rem;
      margin-bottom: 0.02rem;
      display: inline-block;
    }
  }
}
</style>
